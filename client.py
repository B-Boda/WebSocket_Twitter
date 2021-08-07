import websocket
url = 'ws://localhost:8081/'

data="test message"
ws = websocket.create_connection(url)
ws.send(data)
