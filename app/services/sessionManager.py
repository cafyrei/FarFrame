class SessionManager :
    def __init__(self):
        self.participants = {}
        self.next_position = {}
        
    def add_participant(self, participant):
        room_code = participant["room_code"]
        participant_id = participant["participantId"]

        if room_code not in self.participants:
            self.participants[room_code] = {}
            self.next_position[room_code] = 0

        position = self.next_position[room_code]
        self.next_position[room_code] += 1

        participant["position"] = position

        self.participants[room_code][participant_id] = {
            "role": participant["role"],
            "avatar": participant["avatar"],
            "position": position,
        }
    
    def validate_participant(self, room_code, participantId):
        if room_code in self.participants:
            for participant in self.participants[room_code]:
                if participant == participantId:
                    return True
        return False
    
    def display_data(self):
        print(self.participants)
    
    def remove_participant(self, participantId, room_code):
        
        if room_code not in self.participants:
            print("Room Code not Exisitent")
            return
        
        if participantId in self.participants[room_code]:
            del self.participants[room_code][participantId]
        
            
        
# All classes that need Session Manager get data on this instance
sessionManager = SessionManager()