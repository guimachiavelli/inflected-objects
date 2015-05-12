class InflectedStructure
    MARK = '_'

    attr_reader :sections

    def initialize(dir = './content')
        @content = dir
        @sections = {:root => get_content('root')}
        @sections = @sections.merge(get_sections(@sections[:root]))
    end

    def get_content(page, path = nil)
        path ||= File.join(@content, '**')
        dir = Dir.glob(path)
        path = path.gsub('*', '')
        content = {:name => page,
                   :path => path,
                   :page => nil,
                   :subpages => [],
                   :sections => [],
                   :media => {} }
        dir.each_with_object(content) do |item, content|
            basename = File.basename(item)
            symbol = basename.gsub('_', '').gsub('.md', '').to_sym
            if section?(item, basename)
                content[:sections] << symbol
            elsif media?(item, basename)
                content[:media][symbol] = get_media(item)
            elsif index?(basename, content) || page?(basename, page)
                content[:page] = basename
            elsif File.extname(item) == '.md'
                #content[:subpages] << item
                @sections[:root][:subpages] << {name: item, parent: page }
            end
        end
    end

    def get_sections(root)
        root[:sections].each_with_object({}) do |section, sections|
            section_name = section.to_s
            section_path = File.join(@content, section_name, '**')
            sections[section] = get_content(section_name, section_path)
        end
    end

    def get_media(type)
        return type unless File.directory? type
        Dir.glob(File.join(type, '**'))
    end

    def index?(basename, content)
        basename == 'index.md' && content[:page] == nil
    end

    def page?(basename, page)
        page = page.gsub(/[0-9|-]/, '')
        basename == page + '.md'
    end

    def section?(item, basename)
        File.directory?(item) && !basename.start_with?(MARK)
    end

    def media?(item, basename)
        basename.start_with?(MARK)
    end

    def to_s
        puts @sections
    end
end
