require 'fileutils'
require_relative './inflected-structure.rb'
require_relative './inflected-generator.rb'
require_relative './inflected-dropbox.rb'

class InflectedSite
    attr_reader :structure

    def initialize(public_html = './public', content = './content')
        @public = public_html
        @content = InflectedDownloader.new(content)
        @structure = InflectedStructure.new
        @site = InflectedGenerator.new @structure.sections, @public

        if !Dir.exist? @public
            Dir.mkdir(@public)
        end

        publish
    end

    def clear
        FileUtils.rm_r(Dir.glob(File.join(@public, '*')))
    end

    def publish
        clear
        @site.parsed_sections.each do |section, content|
            puts content[:name]
            name = content[:name] == 'root' ? 'index' : content[:name]
            path = File.join(@public, name  + '.html')
            File.write(path, content[:html])

            copy_media content[:media]
        end
    end

    def copy_media(media_type)
        media_type.each do |type, media|
            return nil unless type == :imgs || type == :texts
            type = type.to_s
            dir = File.join(@public, type)
            Dir.mkdir(dir) unless Dir.exists? dir

            media.each do |medium|
                path = File.join(dir, File.basename(medium))
                FileUtils.copy medium, path
            end
        end
    end

end

InflectedSite.new
