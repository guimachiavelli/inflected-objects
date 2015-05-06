require 'kramdown'

class InflectedGenerator
    attr_reader :parsed_sections

    def initialize(sections, public_path)
        @public_path = public_path
        @header = File.read(File.join(File.dirname(__FILE__),
                                      'partials', 'header.html'))
        @footer = File.read(File.join(File.dirname(__FILE__),
                                      'partials', 'footer.html'))

        @parsed_sections = {}

        sections.each do |name, section|
            parsed_section = generate_section_page(section)
            @parsed_sections[name] = parsed_section if parsed_section != nil
        end

    end

    def generate_section_page(section)
        return nil if section[:page] == nil
        page = File.join(section[:path], section[:page])
        page = File.read(page)
        parsed_markdown = Kramdown::Document.new(page).to_html

        doc = @header + parsed_markdown

        #TODO refactor this whole part, using ERB for templating and perhaps
        #     some sort of meta programming thing to iterate different media types
        doc = add_sections(section[:sections], doc)
        doc = add_images(section[:media][:imgs], doc)
        doc += add_videos(section[:media][:videos])
        doc += add_externals(section[:media][:externals])
        doc += add_texts(section[:media][:texts])

        doc += @footer

        section[:html] = doc

        section
    end

    def add_sections(sections, doc)
        return doc if sections.count < 1
        doc += '<h2>Exhibitions</h2>'
        doc += '<ol class="section-list">'
        sections.each do |section|
            section = section.to_s
            path = section + '.html'
            doc += '<li><a href="' + path + '">' + section + '</a></li>'
        end
        doc + '</ol>'
    end

    def add_texts(texts)
        return '' if texts == nil || texts.count < 1
        doc = '<ul class="images">'
        texts.each do |text|
            node = '<li>'
            node += '<a href="texts/' + File.basename(text) + '">' + File.basename(text) + '</a>'
            node += '</li>'
            doc += node
        end
        doc + '</ul>'
    end

    def add_images(imgs, doc)
        return doc if imgs == nil || imgs.count < 1
        doc += '<ul class="images">'
        imgs.each do |img|
            node = '<li>'
            node += '<img src="imgs/' + File.basename(img) + '" alt="">'
            node += '</li>'
            doc += node
        end
        doc + '</ul>'
    end

    def add_videos(videos)
        return '' if videos == nil
        videos = File.read(videos)
        doc = '<ul class="videos">'
        videos.each_line do |video|
            video_id = video.split('?v=')[1]
            doc += '<li><iframe width="560" height="315" src="https://www.youtube.com/embed/' + video_id  + '" frameborder="0" allowfullscreen></iframe></li>'
        end
        doc + '</ul>'
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
