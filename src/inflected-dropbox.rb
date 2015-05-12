require 'dropbox_sdk'
require 'fileutils'

class InflectedDownloader
    PATH = File.dirname(__FILE__)
    SECRET_FILE = File.join(PATH, 'secret', 'secret.txt')
    CREDENTIALS_FILE = File.join(PATH, 'secret', 'credentials.txt')

    def initialize(content_dir)
        @app_secret = get_app_secret(File.read(SECRET_FILE))
        @access_token, @user_id = get_credentials
        @content_dir = File.join(content_dir)
        Dir.mkdir(@content_dir) unless Dir.exists?(@content_dir)

        clear_previous_content
        download
    end

    def clear_previous_content
        FileUtils.rm_r(Dir.glob(File.join(@content_dir, '*')))
    end

    def get_app_secret(file)
        secret = []
        file.each_line do |line|
            secret << line.strip
        end
        secret
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

    def get_credentials
        if File.exists? CREDENTIALS_FILE then
            return get_credentials_from_file
        end

        generate_access_token
    end

    def get_credentials_from_file
        credentials = []

        File.read(CREDENTIALS_FILE).each_line do |line|
            credentials << line.strip
        end

        credentials
    end

    def generate_access_token
        flow = DropboxOAuth2FlowNoRedirect.new(*@app_secret)

        authorize_url = flow.start

        puts authorize_url
        print 'Enter the authorization code here: '

        credentials = flow.finish(gets.strip)

        File.write CREDENTIALS_FILE, credentials.join("\n")

        credentials
    end

end
