require 'yaml'

class InflectedStructure
    MARK = '_'

    attr_reader :sections

    def initialize(dir = './content')
        @content = dir
        @sections = get_content('root', File.join(@content, '**'))
    end

    def get_content(page, path = nil)
        path ||= File.join(@content, '**')
        dir = Dir.glob(path)
        path = path.gsub('*', '')

        content = {
            name: page,
            path: path,
            page: nil,
            children: {},
            media: {}
        }

        dir.each_with_object(content) do |item, content|
            basename = File.basename(item)

            if section?(item, basename)
                section, section_path = section_metadata(item, basename)
                section = File.join(path, section, '**')
                content[:children][basename] = get_content(basename, section)
            elsif media?(item, basename)
                symbol = basename.gsub('_', '').to_sym
                content[:media][symbol] = get_media(item)
            elsif index?(basename, content) || page?(basename, page)
                content[:page] = basename
                content = page_header(content)
            end
        end

    end

    def get_sections(root)
        root[:sections].each_with_object({}) do |section, sections|
            section = section[:path]
            section_path = File.join(@content, section, '**')
            sections[section] = get_content(section, section_path)
        end
    end

    def section_metadata(item, basename)
        section = [ basename, basename.gsub(/[0-9|-]/, '') ]
        section_content = section_page(item, basename)
        return section if section_content.nil?

        section_content = File.read(section_content)
        header = section_content[/---(.|\n)*---/]
        return section if header.nil?

        yaml = YAML.load header
        return section if yaml['title'].nil? || yaml['title'].empty?
        section[1] = yaml['title'].to_s

        section
    end

    def section_page(item, basename)
        item = File.expand_path(item)

        file = File.join(item, basename.gsub(/[0-9]-?/, '') + '.md')
        return file if File.exists?(file)

        file = File.join(item, basename + '.md')
        return file if File.exists?(file)

        file = File.join(item, 'index.md')
        return file if File.exists?(file)

        return nil
    end


    def get_media(type)
        return type unless File.directory? type
        Dir.glob(File.join(type, '**'))
    end

    def index?(basename, content)
        basename == 'index.md' && content[:page] == nil
    end

    def page?(basename, page)
        page = page.gsub(/[0-9]-?/, '')
        basename == page + '.md'
    end

    def section?(item, basename)
        File.directory?(item) && !basename.start_with?(MARK)
    end

    def media?(item, basename)
        basename.start_with?(MARK)
    end

    def page_header(content)
        file = File.join content[:path], content[:page]
        page = File.read(file)

        return content if !has_page_header?(page)

        header = page[/---(.|\n)*---/]
        yaml = YAML.load header
        content[:meta] = yaml

        return content
    end

    def has_page_header?(page_content)
        page_content.start_with? '---'
    end

    def to_s
        puts @sections
    end
end
