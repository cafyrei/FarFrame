class SessionManager :
    def __init__(self):
        self.participants = {}
        
    def add_participant(self,  participant):
        room_code = participant["room_code"]
        participant_id = participant["participantId"]
        participant_role = participant["role"]
        
        if room_code not in self.participants:
            self.participants[room_code] = {}
            
        self.participants[room_code][participant_id] = {
            "role" : participant_role
        }


sessionManager = SessionManager()