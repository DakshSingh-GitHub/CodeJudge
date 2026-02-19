import re
import builtins

WARNING_MESSAGE = "no pinging to any external servers"

# List of modules that are strictly forbidden (related to networking/system access)
FORBIDDEN_MODULES = {
    'socket', 'http', 'urllib', 'requests', 'ftplib', 'telnetlib', 'smtplib', 
    'asyncio', 'multiprocessing', 'os', 'subprocess', 'shutil', 'tempfile'
}

# Regex to catch obvious imports and system calls
RESTRICTED_KEYWORDS = [
    r'import\s+(socket|http|urllib|requests|ftplib|telnetlib|smtplib|asyncio|os|subprocess)',
    r'from\s+(socket|http|urllib|requests|ftplib|telnetlib|smtplib|asyncio|os|subprocess)',
    r'__import__\s*\(',
    r'getattr\s*\(',
    r'exec\s*\(',
    r'eval\s*\(',
    r'os\.(system|popen|spawn|exec|posix_spawn)',
    r'subprocess\.(run|Popen|call|check_call|check_output)'
]

def validate_code(code: str) -> (bool, str):
    """
    Performs static analysis on the code to detect restricted keywords and patterns.
    Returns (True, None) if valid, (False, warning_message) otherwise.
    """
    for pattern in RESTRICTED_KEYWORDS:
        if re.search(pattern, code, re.IGNORECASE):
            return False, WARNING_MESSAGE
    return True, None

def restricted_import(name, globals=None, locals=None, fromlist=(), level=0):
    """
    A custom __import__ function that blocks forbidden modules.
    """
    if name in FORBIDDEN_MODULES:
        raise ImportError(WARNING_MESSAGE)
    
    # Also check fromlist for forbidden submodules or names
    # This is a bit complex for a simple override, but we can at least block the top level
    return original_import(name, globals, locals, fromlist, level)

# Store the original __import__ to use inside our restricted version
original_import = builtins.__import__

def get_safe_globals():
    """
    Returns a dictionary of globals that includes a restricted __import__.
    """
    safe_builtins = builtins.__dict__.copy()
    safe_builtins['__import__'] = restricted_import
    # Remove some dangerous built-ins entirely if possible
    # We'll stick to overriding __import__ for now as it's more flexible
    return {"__builtins__": safe_builtins}
