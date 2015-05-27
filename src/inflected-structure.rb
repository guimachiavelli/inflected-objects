require 'yaml'

class InflectedStructure
    MARK = '_'

    attr_reader :sections

    def initialize(dir = './content')
        @content = dir
        @sections = get_content('root', File.join(@content, '**'), nil, {})
    end

    def get_content(page, path = nil, parent = nil, tree)
        path ||= File.join(@content, '**')
        dir = Dir.glob(path)
        path = path.gsub('*', '')

        content = {
            name: page,
            path: path,
            page: nil,
            sections: [],
            media: {},
            parent: parent
        }

        contents = dir.each_with_object(content) do |item, content|
            basename = File.basename(item)
            symbol = basename.gsub('_', '').gsub('.md', '').to_sym

            if section?(item, basename)
                content[:sections] << section_metadata(item, basename)
            elsif media?(item, basename)
                content[:media][symbol] = get_media(item)
            elsif index?(basename, content) || page?(basename, page)
                content[:page] = basename
                content = page_header(content)
            end
        end

        tree[page.to_sym] = contents

        if (contents[:sections] && contents[:sections].count > 0)
            contents[:sections].each do |section|
                parent = contents[:name].to_s
                section = section[:path]
                section = File.join(parent, section) if parent != 'root'
                section_path = File.join(@content, section, '**')
                get_content(section, section_path, contents[:name], tree)
            end
        end

        tree
    end

    def get_sections(root)
        root[:sections].each_with_object({}) do |section, sections|
            section = section[:path]
            section_path = File.join(@content, section, '**')
            sections[section] = get_content(section, section_path)
        end
    end

    def section_metadata(item, basename)
        section = { path: basename, title: basename.gsub(/[0-9|-]/, '') }
        section_content = section_page(item, basename)
        return section if section_content.nil?

        section_content = File.read(section_content)
        header = section_content[/---(.|\n)*---/]
        return section if header.nil?

        yaml = YAML.load header
        return section if yaml['title'].nil? || yaml['title'].empty?
        section[:title] = yaml['title'].to_s

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
        puts basename if page == '01.1a,b,c'
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
