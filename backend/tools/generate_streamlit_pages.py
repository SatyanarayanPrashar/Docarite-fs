import os

DOCUMENT_FOLDER = "Document"
PAGES_FOLDER = "pages"


def generate_pages():
    os.makedirs(PAGES_FOLDER, exist_ok=True)

    md_files = [f for f in os.listdir(DOCUMENT_FOLDER) if f.endswith(".md")]
    md_files.sort()
    for idx, md_file in enumerate(md_files, start=1):
        base_name = os.path.splitext(md_file)[0]
        md_path = os.path.join(DOCUMENT_FOLDER, md_file)
        
        py_content = f'''import streamlit as st

        with open("{md_path}", "r") as file:
            content = file.read()

        st.markdown(content)
        '''

        py_file_name = f"{idx}_{base_name.lower()}.py"
        py_file_path = os.path.join(PAGES_FOLDER, py_file_name)

        with open(py_file_path, "w") as py_file:
            py_file.write(py_content)

        print(f"✅ Created: {py_file_path}")
