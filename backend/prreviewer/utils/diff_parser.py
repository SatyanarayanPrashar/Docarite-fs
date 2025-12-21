import re

def add_line_numbers_to_diff(diff_text):
    """
    Parses a git diff string and prefixes lines with their actual line number 
    in the new file version.
    """
    lines = diff_text.split('\n')
    processed_lines = []
    
    # "current_line_number" tracks the line number in the *new* file
    current_line_number = None

    for line in lines:
        # Detect Hunk Header: e.g., @@ -38,4 +39,19 @@
        header_match = re.match(r'^@@ -\d+(?:,\d+)? \+(\d+)(?:,\d+)? @@', line)
        
        if header_match:
            current_line_number = int(header_match.group(1))
            processed_lines.append(line)
            continue

        if current_line_number is None:
            processed_lines.append(line)
            continue

        # Handle Diff Content
        if line.startswith(' '): 
            processed_lines.append(f"{current_line_number} | {line}")
            current_line_number += 1
            
        elif line.startswith('+'): 
            processed_lines.append(f"{current_line_number} | {line}")
            current_line_number += 1
            
        elif line.startswith('-'): 
            processed_lines.append(f"    | {line}")
            
        else:
            processed_lines.append(line)

    return "\n".join(processed_lines)