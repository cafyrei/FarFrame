import secrets
import random
import string

alphabet = string.ascii_uppercase + string.digits

def generate_room_code():
    """Generates a random 6-character room code consisting of uppercase letters and digits."""
    return ''.join(secrets.choice(alphabet) for _ in range(6))

def generate_participant_id():
    """Generates a random particpant ID consisting of uppercase letters and digits."""
    return ''.join(secrets.choice(string.digits) for _ in range(4))

def generate_avatar_selector():
    """Generates a random number for avatar."""
    return random.randint(0,3)