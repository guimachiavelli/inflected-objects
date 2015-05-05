require 'kramdown'
require 'nokogiri'

class InflectedGenerator
    attr_reader :parsed_sections

    def initialize(sections, public_path)
        @public_path = public_path
        @header = File.read(File.join(File.dirname(__FILE__),
                                      'partials', 'header.html'))
        @footer = File.read(File.join(File.dirname(__FILE__),
                                      'partials', 'footer.html'))

        @parsed_sections = {:root => generate_section_page(sections[:root])}
    end

    def generate_section_page(section)
        page = File.join(section[:path], section[:page])
        page = File.read(page)
        parsed_markdown = Kramdown::Document.new(page).to_html

        doc = @header + parsed_markdown

        doc = add_images(section[:media][:imgs], doc)

        doc += @footer

        section[:html] = doc

        section
    end

    def add_images(img_list, doc)
        doc += '<ul class="images">'
        img_list.each do |img|
            node = '<li>'
            node += '<img src="imgs/' + File.basename(img) + '" alt="">'
            node += '</li>'
            doc += node
        end
        doc + '</ul>'
    end

end
