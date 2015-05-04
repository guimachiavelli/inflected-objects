require 'kramdown'

class InflectedGenerator
    attr_reader :parsed_sections

    def initialize(sections)
        @parsed_sections = {:root => generate_section_page(sections[:root])}
    end

    def generate_section_page(section)
        page = File.join(section[:path], section[:page])
        page = File.read(page)
        html = Kramdown::Document.new(page).to_html

        section[:html] = html

        section
    end

end
