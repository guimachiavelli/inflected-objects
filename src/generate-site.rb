class Structure
    MARK = '_'
    CONTENT_TPL = { :page => nil, :sections => [], :special => [] }

    def initialize(dir = './content')
        @content = dir
        @root = get_content('root')
        @sections = get_sections(@root)
    end

    def get_content(page, path = nil)
        path ||= File.join(@content, '**')
        dir = Dir.glob(path)
        content = { :page => nil, :sections => [], :special => [] }
        dir.each_with_object(content) do |item, content|
            basename = File.basename(item)
            if section?(item, basename)
                content[:sections] << basename.to_sym
            elsif special?(item, basename)
                content[:special] << basename.to_sym
            elsif index?(basename, content) || page?(basename, page)
                content[:page] = item
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

    def index?(basename, content)
        basename == 'index.md' && content[:page] == nil
    end

    def page?(basename, page)
        basename == page + '.md'
    end

    def section?(item, basename)
        File.directory?(item) && !basename.start_with?(MARK)
    end

    def special?(item, basename)
        File.directory?(item) && basename.start_with?(MARK)
    end

    def to_s
        puts 'Root:'
        puts @root
        puts 'Sections:'
        @sections.each { |section, content| puts section }
    end


end

site = Structure.new

puts site
