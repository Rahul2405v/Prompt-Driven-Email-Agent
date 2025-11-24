import re

def find(text : str):
    ids = re.findall(r"msg_[0-9a-fA-F]{8}", text)
    return ids