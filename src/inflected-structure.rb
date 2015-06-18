require 'yaml'
require 'kramdown'

class InflectedStructure
    MARK = '_'
    WHITELIST = {
        'imgs' => ['.jpg', '.gif', '.png', '.jpeg', '.webp'],
        'texts' => ['.txt', '.md', '.mdown', '.markdown'],
        'sounds' => ['.mp3', '.ogg']
    }

    attr_reader :sections

    def initialize(dir = './content')
        @content = dir
        @sections = get_content('root', File.join(@content, '**'))
    end

    def get_content(page, path = nil)
        path ||= File.join(@content, '**')
        dir = Dir.glob(path).sort
        path = path.gsub('*', '')

        content = {
            name: page,
            path: path,
            public_path: File.basename(path),
            title: nil,
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
                symbol = basename.gsub('_', '').gsub('.md','').to_sym
                content[:media][symbol] = get_media(item)
            elsif index?(basename, content) || page?(basename, page)
                content[:page] = basename
                content[:meta] = page_header(content)
                content[:title] = basename.gsub('.md', '')
                if content[:meta]['title'] != nil && content[:meta]['title'] != ''
                    content[:title] = content[:meta]['title']
                end
                content[:public_path] = '#' if content[:meta]['type'] == 'exhibition'
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
        entries = Dir.glob(File.join(type, '**'))
        basename = File.basename(type)
        media_captions = captions(entries)
        entries = filter(entries, basename)
        entries = carousels(entries) if basename == '_imgs'
        entries = assign_captions_to_entries(media_captions, entries)
        entries
    end

    def carousels(entries)
        entries.map do |entry|
            next entry unless File.directory? entry
            Dir.glob(File.join(entry, '*'))
        end
    end

    def filter(entries, type)
        accepted_files = WHITELIST[type.gsub('_','')]
        entries.select do |entry|
            accepted_files.include?(File.extname(entry)) || File.directory?(entry)
        end
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

    def captions(entries)
        entries.each_with_object({}) do |entry, caption|
            next entry if (entry.class == Array ||
                File.basename(entry) != 'captions.md')
            File.readlines(entry).each do |line|
                next if line == "\n"
                key, value = line.split(':')
                caption[key.strip] = Kramdown::Document.new(value).to_html
            end
        end
    end

    def assign_captions_to_entries(captions, entries)
        entries.map do |entry|
            if entry.class == Array
                assign_captions_to_entries(captions, entry)
            else
                {path: entry, caption: captions[File.basename(entry)]}
            end
        end
    end

    def page_header(content)
        file = File.join content[:path], content[:page]
        page = File.read(file)

        return {} if !has_page_header?(page)

        header = page[/---(.|\n)*---/]
        YAML.load header
    end

    def has_page_header?(page_content)
        page_content.start_with? '---'
    end

    def to_s
        puts @sections
    end
end
