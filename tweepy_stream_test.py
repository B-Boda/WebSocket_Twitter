import tweepy
import json
import key

consumer_key = key.twkey["CK"]
consumer_secret = key.twkey["CS"]
auth = tweepy.OAuthHandler(consumer_key, consumer_secret)

access_token = key.twkey["AK"]
access_secret = key.twkey["AS"]
auth.set_access_token(access_token, access_secret)

api = tweepy.API(auth)

ids = api.friends_ids("305_tb_")
ids_str = [str(n) for n in ids]
ids_str.append("920915076369891328")

print("------------\n")

class MyStreamListener(tweepy.StreamListener):

	def on_status(self, status):
		#print(json.dumps(status._json,ensure_ascii=False))
		print(status.entities)
		print("\n------------\n")


myStreamListener = MyStreamListener()
myStream = tweepy.Stream(auth=api.auth, listener=myStreamListener)
myStream.filter(follow=ids_str)
