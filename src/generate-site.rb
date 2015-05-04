require 'fileutils'
require_relative './inflected-structure.rb'
require_relative './inflected-generator.rb'

class InflectedSite
    attr_reader :structure

    def initialize(public_html = './public')
        @public = public_html
        @structure = InflectedStructure.new
        @site = InflectedGenerator.new @structure.sections

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
        end
    end

end

InflectedSite.new
