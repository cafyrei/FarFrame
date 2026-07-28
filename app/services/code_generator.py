import secrets
import string

alphabet = string.ascii_uppercase + string.digits

def generate_room_code():
    """Generates a random 6-character room code consisting of uppercase letters and digits."""
    return ''.join(secrets.choice(alphabet) for _ in range(6))