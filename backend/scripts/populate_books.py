# populate_books_v2.py - VERSIÓN MEJORADA

import requests
import psycopg2
import time
import random
from psycopg2.extras import execute_values

# ============================================
# CONFIGURACIÓN
# ============================================
DATABASE_URL = "postgresql://library_user:Zqt906I5TLcpLwa59UJMN9WWVxE3sqDr@dpg-d6c3d5kr85hc73ds9t0g-a.oregon-postgres.render.com/library_db_l88q"
USER_AGENT = "LibraryPopulator/2.0 (usanaconisa@gmail.com)"
TARGET_BOOKS = 100000
BATCH_SIZE = 500  # Reducido para menos presión en BD

# Más idiomas
LANGUAGES = ['eng', 'spa', 'fre', 'ger', 'ita', 'por', 'tur', 'ara', 'jpn', 'rus', 'ara']

# Más temas variados
TOPICS = [
    # Ficción
    "fiction", "science fiction", "fantasy", "mystery", "thriller",
    "romance", "adventure", "horror", "dystopian", "historical fiction",
    
    # No ficción
    "history", "biography", "science", "technology", "philosophy",
    "psychology", "economics", "business", "self-help", "health",
    "cooking", "travel", "art", "music", "sports",
    
    # Específicos
    "programming", "mathematics", "physics", "chemistry", "biology",
    "politics", "religion", "education", "parenting", "gardening"
]

# ============================================
# FUNCIONES MEJORADAS
# ============================================

def fetch_books_from_openlibrary(topic, language, offset=0, limit=100, retries=10, backoff=3):
    """
    Versión mejorada con:
    - Más reintentos (10 en vez de 5)
    - Offset para paginación
    - Límite más bajo (100) para menos presión
    - Backoff inicial más largo (3s)
    """
    url = "https://openlibrary.org/search.json"
    params = {
        "q": topic,
        "language": language,
        "limit": limit,
        "offset": offset,
        "fields": "key,title,author_name,first_publish_year,isbn,publisher,subject,language,cover_i"
    }
    headers = {'User-Agent': USER_AGENT}
    
    for attempt in range(retries):
        try:
            print(f"    [{topic}/{language}] Offset {offset}, intento {attempt+1}...")
            response = requests.get(url, params=params, headers=headers, timeout=45)
            
            if response.status_code == 500:
                wait_time = backoff * (2 ** attempt)  # Exponencial: 3, 6, 12, 24...
                print(f"    ⚠️  Error 500. Esperando {wait_time}s antes de reintentar...")
                time.sleep(wait_time)
                continue
            
            response.raise_for_status()
            data = response.json()
            num_found = data.get('numFound', 0)
            docs = data.get('docs', [])
            print(f"    ✅ {len(docs)} libros obtenidos (total disponible: {num_found})")
            return docs, num_found
            
        except requests.exceptions.Timeout:
            print(f"    ⏱️  Timeout. Reintentando...")
            time.sleep(backoff)
        except requests.exceptions.RequestException as e:
            print(f"    ❌ Error: {e}")
            if attempt == retries - 1:
                return [], 0
            time.sleep(backoff * (attempt + 1))
    
    return [], 0

def map_book_data(api_book, language):
    """Mapeo mejorado con validación"""
    # ISBN-13 preferido
    isbn_list = api_book.get('isbn', [])
    isbn = None
    for i in isbn_list:
        i_str = str(i).replace('-', '').replace(' ', '')
        if len(i_str) == 13 and i_str.isdigit():
            isbn = i_str
            break
    if not isbn and isbn_list:
        i_str = str(isbn_list[0]).replace('-', '').replace(' ', '')
        if i_str.isdigit() and len(i_str) >= 10:
            isbn = i_str
    
    if not isbn:
        return None  # Ignorar libros sin ISBN
    
    title = api_book.get('title', 'Sin título')[:200]
    
    author_list = api_book.get('author_name', ['Unknown'])
    author = ', '.join(author_list[:3])[:200]  # Max 3 autores
    
    publisher_list = api_book.get('publisher', [])
    publisher = publisher_list[0][:200] if publisher_list else 'Unknown'
    
    pub_year = api_book.get('first_publish_year')
    
    # Copias aleatorias
    total = random.randint(1, 5)
    available = random.randint(0, total)
    
    subjects = api_book.get('subject', [])
    subject_str = ', '.join(subjects[:3]) if subjects else 'General'
    description = f"{subject_str}. From Open Library."[:500]
    
    # URL de portada
    cover_id = api_book.get('cover_i')
    cover_url = f"https://covers.openlibrary.org/b/id/{cover_id}-L.jpg" if cover_id else None
    
    # Mapear código de idioma
    lang_map = {
        'eng': 'en', 'spa': 'es', 'fre': 'fr', 'ger': 'de',
        'ita': 'it', 'por': 'pt', 'tur': 'tr', 'ara': 'ar',
        'jpn': 'ja', 'rus': 'ru', 'ara': 'ar'
    }
    lang_code = lang_map.get(language, 'en')
    
    return {
        'isbn': isbn,
        'title': title,
        'author': author,
        'publisher': publisher,
        'publication_year': pub_year,
        'total_copies': total,
        'available_copies': available,
        'description': description,
        'cover_image_url': cover_url,
        'language': lang_code
    }

def insert_books_batch(books_data):
    """Inserción con manejo de errores mejorado"""
    if not books_data:
        return 0
    
    try:
        conn = psycopg2.connect(DATABASE_URL)
        cur = conn.cursor()
        
        # Primero obtener una categoría por defecto
        cur.execute("SELECT id FROM categories LIMIT 1")
        default_cat = cur.fetchone()
        category_id = default_cat[0] if default_cat else None
        
        insert_query = """
            INSERT INTO books 
            (isbn, title, author, publisher, publication_year, 
             total_copies, available_copies, description, cover_image_url, language, category_id)
            VALUES %s
            ON CONFLICT (isbn) DO NOTHING
        """
        
        data_tuples = [
            (b['isbn'], b['title'], b['author'], b['publisher'],
             b['publication_year'], b['total_copies'], b['available_copies'],
             b['description'], b['cover_image_url'], b['language'], category_id)
            for b in books_data
        ]
        
        execute_values(cur, insert_query, data_tuples)
        inserted = cur.rowcount
        conn.commit()
        
        cur.close()
        conn.close()
        
        print(f"      💾 {inserted} libros nuevos insertados")
        return inserted
        
    except Exception as e:
        print(f"      ❌ Error BD: {e}")
        return 0

def get_current_count():
    """Obtener conteo actual de libros"""
    try:
        conn = psycopg2.connect(DATABASE_URL)
        cur = conn.cursor()
        cur.execute("SELECT COUNT(*) FROM books")
        count = cur.fetchone()[0]
        cur.close()
        conn.close()
        return count
    except:
        return 0

# ============================================
# PROGRAMA PRINCIPAL MEJORADO
# ============================================
if __name__ == "__main__":
    print("🚀 POBLACIÓN DE BD - VERSIÓN MEJORADA")
    print(f"📊 Objetivo: {TARGET_BOOKS:,} libros")
    print(f"📚 Estado actual: {get_current_count():,} libros\n")
    
    collected_books = []
    total_inserted = 0
    
    for lang in LANGUAGES:
        current_count = get_current_count()
        if current_count >= TARGET_BOOKS:
            print(f"\n🎉 ¡Objetivo alcanzado! {current_count:,} libros en BD")
            break
        
        print(f"\n{'='*60}")
        print(f"🌍 IDIOMA: {lang.upper()}")
        print(f"{'='*60}")
        
        for topic in TOPICS:
            current_count = get_current_count()
            if current_count >= TARGET_BOOKS:
                break
            
            print(f"\n  📖 Tema: {topic}")
            
            # Paginación: obtener hasta 1000 libros por tema
            offset = 0
            while offset < 1000:
                docs, num_found = fetch_books_from_openlibrary(
                    topic, lang, offset=offset, limit=100
                )
                
                if not docs:
                    print(f"    ⏭️  Sin más resultados")
                    break
                
                # Mapear libros
                for doc in docs:
                    mapped = map_book_data(doc, lang)
                    if mapped:
                        collected_books.append(mapped)
                
                # Insertar en lotes
                if len(collected_books) >= BATCH_SIZE:
                    inserted = insert_books_batch(collected_books)
                    total_inserted += inserted
                    collected_books = []
                    
                    current = get_current_count()
                    print(f"    📊 Total en BD: {current:,} ({(current/TARGET_BOOKS*100):.1f}%)")
                
                offset += 100
                time.sleep(2)  # Pausa entre páginas
            
            time.sleep(3)  # Pausa entre temas
        
        time.sleep(5)  # Pausa entre idiomas
    
    # Insertar últimos libros
    if collected_books:
        insert_books_batch(collected_books)
    
    final_count = get_current_count()
    print(f"\n{'='*60}")
    print(f"✨ COMPLETADO")
    print(f"📚 Total en BD: {final_count:,} libros")
    print(f"🎯 Progreso: {(final_count/TARGET_BOOKS*100):.1f}%")
    print(f"{'='*60}")
