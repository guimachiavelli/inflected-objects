require 'dropbox_sdk'
require 'fileutils'
require 'yaml'

class InflectedDownloader
    PATH = File.dirname(__FILE__)
    CREDENTIALS_FILE = File.join(PATH, 'secret', 'credentials.txt')
    CONFIG_FILE = File.join(File.expand_path('..', PATH), 'config.yml')

    def initialize(content_dir)
        config = YAML.load_file(CONFIG_FILE)

        @app_secret, @app_key = get_app_secret(config)
        @access_token, @user_id = get_credentials(config)

        @content_dir = File.join(content_dir)
        Dir.mkdir(@content_dir) unless Dir.exists?(@content_dir)

        clear_previous_content
        download
    end

    def get_app_secret(config)
        app = config['credentials']['app']

        return [app['key'], app['secret']]
    end

    def get_credentials(config)
        user = config['credentials']['user']
        return [user['token'], user['id']] if user != nil && user.include?('token')

        generate_access_token(config)
    end

    def generate_access_token(config)
        flow = DropboxOAuth2FlowNoRedirect.new(@app_secret, @app_key)

        authorize_url = flow.start

        puts config
        puts authorize_url
        print 'Enter the authorization code here: '

        credentials = flow.finish(gets.strip)

        config['credentials']['user'] = {
            'token' => credentials[0],
            'id' => credentials[1]
        }

        File.write(CONFIG_FILE, config.to_yaml)

        credentials
    end

    def clear_previous_content
        FileUtils.rm_r(Dir.glob(File.join(@content_dir, '*')))
    end

    def connect
        @client = DropboxClient.new @access_token
    end

    def download(path = '/')
        connect

        files = @client.metadata(path)['contents']

        files.each do |file|
            if file['is_dir'] == true
                dir_path = File.join(@content_dir, file['path'])
                dir_path = File.expand_path(dir_path)
                Dir.mkdir(dir_path) unless Dir.exists?(dir_path)
                download(file['path'])
            else
                download_file(file['path'])
            end
        end
    end

    def download_file(path)
        contents = @client.get_file(path)
        File.write(@content_dir + path, contents)
    end
end
