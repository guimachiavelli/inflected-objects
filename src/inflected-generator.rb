require 'kramdown'
require 'erb'

class InflectedGenerator
    attr_reader :parsed_sections

    PATH = File.dirname(__FILE__)
    TPL_PATH = File.join(PATH, 'templates', 'index.html.erb')

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
        @sections = section[:sections]
        @imgs = section[:media][:imgs]
        @videos = get_video_list(section[:media][:videos])
        @texts = section[:media][:texts]
        @externals = get_externals_list(section[:media][:externals])

        section[:html] = html.result(binding)

        section
    end

    def get_video_list(file)
        return if file == nil
        File.readlines(file).map { |line| line.split('v=')[1] }
    end

    def get_externals_list(file)
        return if file == nil
        File.readlines(file)
    end

    def add_externals(externals)
        return '' if externals == nil
        doc = '<ul class="externals">'
        externals = File.read(externals)
        externals.each_line do |external|
            puts external
            doc += '<li><iframe src="' + external + '" width="500" height="500"></iframe></li>'
        end
        doc + '</ul>'
    end
end
