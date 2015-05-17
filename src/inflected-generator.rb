require 'kramdown'
require 'erb'

class InflectedGenerator
    attr_reader :parsed_sections

    PATH = File.dirname(__FILE__)
    TPL_PATH = File.join(File.expand_path('..', PATH),
                         'template',
                         'html',
                         'index.html.erb')

    def initialize(sections, public_path)
        @public_path = public_path
        @tpl = File.read(TPL_PATH)

        @parsed_sections = {}

        sections.each do |name, section|
            parsed_section = generate_section_page(section)
            @parsed_sections[name] = parsed_section if parsed_section != nil
        end
    end

    def generate_section_page(section)
        return nil if section[:page] == nil
        html = ERB.new(@tpl)
        page = File.join(section[:path], section[:page])
        page = File.read(page)
        @content = Kramdown::Document.new(page).to_html
        @name = section[:name]
        @sections = section[:sections]
        @imgs = section[:media][:imgs]
        @videos = get_video_list(section[:media][:videos])
        @texts = section[:media][:texts]
        @externals = get_externals_list(section[:media][:externals])
        @subpages = get_subpages(section[:subpages])

        section[:html] = html.result(binding)

        section
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
