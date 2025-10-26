import sys




def progress_bar(current, total, bar_length=30):
    fraction = current / total
    # Calculate filled length and build bar
    filled_length = int(bar_length * fraction)
    bar = '=' * filled_length + '>' + ' ' * (bar_length - filled_length)
    
    # Print without newline, overwrite line with \r
    sys.stdout.write(f'\r[{bar}] {current}/{total} ({fraction*100:.1f}%)')
    sys.stdout.flush()
    
    # Newline when done
    if current == total:
        sys.stdout.write('\n')