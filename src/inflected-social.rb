require 'twitter'
require 'instagram'
require 'erb'

class InflectedSocial
    KEY = 'Of6UJMzaqnTwfPJnv2wzvfrkl'
    SECRET = 'CPG0GtTNRNFbFFsp7iJiszWyZEJKwb8QXzIHi0w7J00Do120XS'
    TOKEN = '248270987-6o9UYKKBVVwEiteF1tsHYXe33cmAgI4gIjOuQsqs'
    TOKEN_SECRET = '2Vl3CelPleEoaxeOkuhLxuQQyUAMrevPB80Z8qFtU7NN3'
    USER_HANDLE = 'lunchbytes'
    HASHTAGS = ['digitalart', 'inflectedobjects', 'postinternet']

    INSTAGRAM_TOKEN = '1922142485.050fd5a.918c6442a9d04928a754532dde856033'
    TEST_TOKEN = '10295251.050fd5a.0df78a1ec668433c981c2d6cbc626e97'
    INSTAGRAM_CLIENT = '050fd5a405a14c8ca6e160892ddf119a'

    TEMPLATE = File.join(File.expand_path('..', File.dirname(__FILE__)),
                         'template', 'html', 'social.html.erb')

    def initialize
        @twitter = twitter_client
        @instagram = instagram_client
        @hashtags, @users = twitter_terms()
    end

    def twitter_terms
        begin
            content = File.read(File.join(
                                File.expand_path('..', File.dirname(__FILE__)),
                                'content', 'twitter.txt'
                           ))
            content = content.lines.map(&:chomp)

            return [
                content.select {|line| !line.start_with? '@' },
                content.select {|line| line.start_with? '@' }
            ]
        rescue
            content = [[],[]]
        end
    end

    def twitter_client
        Twitter::REST::Client.new do |config|
            config.consumer_key = KEY
            config.consumer_secret = SECRET
            config.access_token = TOKEN
            config.access_token_secret = TOKEN_SECRET
        end
    end

    def instagram_client
        #Instagram.client({ access_token: INSTAGRAM_TOKEN })
        Instagram.client({ access_token: TEST_TOKEN })
    end

    def fetch
        @pics = instagram_pics
        @tweets = fetched_tweets
        @feed = @pics + @tweets
    end

    def page
        html = ERB.new(File.read(TEMPLATE))
        @social_items = @feed.sample(10)

        {
            media: {},
            children: {},
            meta: {"title" => "Social"},
            name: "social",
            html: html.result(binding)
        }
    end

    def instagram_pics
        user_ids = @users.map do |user|
            user = @instagram.user_search(user)
            return nil if user.length < 1
            user[0]['id']
        end
        user_ids = user_ids.select { |id| !id.nil? }

        pics = user_ids.map do |user|
            begin
                @instagram.user_recent_media(user)
            rescue
                []
            end
        end
        pics = pics.flatten
        pics.concat(@instagram.user_recent_media[0..5])

        pics.map do |pic|
            {
                id: pic.id,
                type: 'instagram',
                link: pic.link,
                image: pic.images.standard_resolution.url,
                text: pic.caption.nil? ? nil : pic.caption.text
            }
        end
    end

    def fetched_tweets
        tweets = timeline
        tweets.concat(tweets_with_hashtags)

        tweets.map do |tweet|
            {
                id: tweet.id,
                type: 'tweet',
                text: tweet.full_text,
                link: nil
            }
        end
    end

    def timeline
        users = @users.map do |user|
            begin
                @twitter.user_timeline(user)
            rescue
                []
            end
        end
        users.flatten
    end

    def tweets_with_hashtags
        hashtags = stringified_hashtag_array
        if hashtags.empty? then return [] end
        query = hashtags + " -rt"
        @twitter.search(query, { count: 10 }).take(10)
    end

    def stringified_hashtag_array
        hashtags = @hashtags.map { |tag| "#{tag.gsub(' ', '+')}" }
        hashtags.join(" OR ")
    end
end
