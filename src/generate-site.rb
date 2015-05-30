require 'fileutils'
require_relative './inflected-structure.rb'
require_relative './inflected-generator.rb'
require_relative './inflected-dropbox.rb'

class InflectedSite
    attr_reader :structure

    def initialize(public_html = './public', content = './content')
        @public = public_html
        @assets = File.join(@public, 'assets')
        @content = InflectedDownloader.new(content)
        @structure = InflectedStructure.new
        @site = InflectedGenerator.new @structure.sections, @public

        Dir.mkdir(@public) unless Dir.exist? @public
        Dir.mkdir(@assets) unless Dir.exist? @assets

        publish
    end

    def clear
        FileUtils.rm_r(Dir.glob(File.join(@public, 'assets' ,'*')))
        FileUtils.rm_r(Dir.glob(File.join(@public, '*.html')))
    end

    def publish
        clear
        create_page(@site.parsed_sections)
    end

    def create_page(page)
        dir = File.dirname(File.join(@public, page[:name]))
        FileUtils.mkdir_p(dir) unless File.exists?(dir)
        name = page[:name] == 'root' ? 'index' : page[:name]
        path = File.join(@public, name  + '.html')

        File.write(path, page[:html])

        copy_media page[:media]

        page[:children].each { |name, content| create_page(content)  }
    end

    def copy_media(media_type)
        media_type.each do |type, media|
            return nil unless type == :imgs || type == :texts
            type = type.to_s
            dir = File.join(@assets, type)
            Dir.mkdir(dir) unless Dir.exists? dir

            media = media.flatten
            media.each do |medium|
                dest = File.join(dir, File.basename(medium))
                parent_dir = File.expand_path('..', dest)
                FileUtils.mkdir_p(parent_dir) unless Dir.exists?(parent_dir)
                FileUtils.copy medium, dest
            end
        end
    end
end

InflectedSite.new
