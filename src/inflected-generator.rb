require 'kramdown'
require 'erb'

class InflectedGenerator
    attr_reader :parsed_sections

    PATH = File.dirname(__FILE__)

    TPL_PATHS = {
        index: 'index.html.erb',
        exhibition: 'exhibition.html.erb',
        text: 'text.html.erb'
    }

    def initialize(sections, public_path)
        @public_path = public_path
        @tpls = fetch_section_tpls
        @all_sections = sections
        @parsed_sections = {}

        sections.each do |name, section|
            parsed_section = generate_section_page(section)
            @parsed_sections[name] = parsed_section if parsed_section != nil
        end
    end

    def fetch_section_tpls
        common_path = File.expand_path('..', PATH)
        common_path = File.join(common_path, 'template', 'html')

        tpls = {}
        TPL_PATHS.each do |type, path|
            tpls[type] = File.read(File.join(common_path, path))
        end

        tpls
    end

    def generate_section_page(section)
        return nil if section[:page] == nil
        meta = section[:meta] || {}
        type = meta['type'] || 'index'
        type = type.to_sym

        html = ERB.new(@tpls[type])
        page = File.join(section[:path], section[:page])
        page = File.read(page).gsub(/---(.|\n)*---/, '')

        @content = Kramdown::Document.new(page).to_html
        @name = section[:name]
        @title = meta['title'] || ''
        @sections = section[:sections]
        @imgs = section[:media][:imgs]
        @videos = get_video_list(section[:media][:videos])
        @texts = section[:media][:texts]
        @externals = get_externals_list(section[:media][:externals])
        @sections = subsections(@sections)
        puts @sections

        section[:html] = html.result(binding)

        section
    end

    def subsections(sections)
        return [] if sections.nil?
        sections.map do |section|
            section_name = section[:path].to_sym
            subsections = @all_sections[section_name]
            section[:subsections] = subsections[:sections] unless subsections.nil?
            section
        end
    end

    def get_subpages(subpages)
        subpages.map do |page|
            {
                :name => File.basename(page[:name]).gsub('.md', ''),
                :content => Kramdown::Document.new(page[:name]).to_html,
                :parent => page[:parent]
            }
        end
    end

    def get_video_list(file)
        return if file == nil
        File.readlines(file).map { |line| line.split('v=')[1] }
    end

    def get_externals_list(file)
        return if file == nil
        File.readlines(file)
    end
end
