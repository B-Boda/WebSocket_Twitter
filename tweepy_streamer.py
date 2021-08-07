import tweepy
import websocket
import key

consumer_key = key.twkey["CK"]
consumer_secret = key.twkey["CS"]
auth = tweepy.OAuthHandler(consumer_key, consumer_secret)

access_token = key.twkey["AT"]
access_secret = key.twkey["AS"]
auth.set_access_token(access_token, access_secret)

api = tweepy.API(auth)

ids = api.friends_ids("305_tb_")
ids_str = [str(n) for n in ids]
ids_str.append("920915076369891328")

#ws
ws = websocket.WebSocket()
url = 'ws://localhost:8081/'
def send_ws(text):
	ws.send(text)

ws.connect(url)
print("------------\n")

class MyStreamListener(tweepy.StreamListener):

	def on_status(self, status):
		print(status.text)
		send_ws(status.text)
		print("\n------------\n")


myStreamListener = MyStreamListener()
myStream = tweepy.Stream(auth=api.auth, listener=myStreamListener)
myStream.filter(follow=ids_str)
ws.close()