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
    
    def validate_participant(self, room_code, participantId):
        if room_code in self.participants:
            for participant in self.participants[room_code]:
                if participant == participantId:
                    return True
        return False
    
    
            
        
# All classes that need Session Manager get data on this instance
sessionManager = SessionManager()