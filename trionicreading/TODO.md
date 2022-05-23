#Trionic Reading
 A customizable text-emphasizing reading aid prototype

## TODO:

### Backlog
- first-and-last coloring option?  
- color picker for color emphasis mode  
- on page load, put cursor focus on input?  
- css toggleswitch for switching emphasis mode?  
- slider to adjust column width  
  - multiple columns?  
   - adjustment for number of columns (slider, dropdown, button, ...)  
- support more seperators?  
  - hypens  
- add init function for 'bottom-to-top' button so it's default can be adjusted  
- add font selector  
- font size adjuster (slider? dropdown? numerical text input? combination?)  

### Todo
- [ ] revise fixation algorithm  
- [ ] Adjustable saccades  
  - [ ] Variable range (1-5?)  
  - [ ] Build UI  
- [ ] redesign page layout / css rearrange/cleanup/reorganize (UI/UX)  
- [ ] Color picker for emphasis mode and fixations  

### Completed - [x]
- [x] fix font-weight problem  
- [x] add TODO.md link  


## Ideas
- first-and-last-letter coloring option  
- color picker for color emphasis mode
- color picker for both halves of word (emphasized and not) regardless of mode
- consider algorithm with saccade style option that skips fixations on words under a certain length threshold  
- opacity: see NOTES below  



## Notes

"opacity" would make text less readable, so instead of lowering alpha channel of text color,
    color hex will be calculated based on an arbitrarily-selected "background" color.
    heirarchy: first select- text highlight color-> text background color-> text parent background color-> 
        keep going until a color is discovered.  document.body background-color is default.
        background colors with an alpha value above a threshold of X should be- ignored?
        background images will fubar this process up.  could do javascript pixelsampling to get a color,
        or instead just pray.

```text
plugin: dealing with various elements; (<p>, <h1>, <h2>, <h6>, <b> etc.)

  The below attempt at categorization is too complex and granular.
  Perhaps a categorical approach would be more appropriate?

  reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Element

  (<b> in particular; should it be skipped?) (probably)
  (should headings and titles be skipped?)
		(things to definitely skip: <head>, alt text, table cells, captions, urls(<a>, <link>, <base>, <meta>, <style>), <address>, <abbr>, <b>, <br>, <cite>, <code>, <data>, )
		(maybe: <title>, <article>, <aside>, <footer>, <header>, !!<nav>!!, <section>, <figcaption>, <figure>, <menu>, <dfn>, )

		(not sure what to do with; <div>, lists(these could take various forms, such as <li>, <ol>, <ul>, ), <dd>, <dl>, <dt>, <hr>, <bdi>, <bdo>, )
		(<pre> preformatted text: could go either way; test and research it's use)
		(<em> emphasis: not only this must be considered, but also nested emphasis must be considered.)
		(<i> idiomatic: historically italic. Probably best to avoid like with bold?)
		(<span> huhboy.)

		(things that likely will benefit from having this applied:
				untagged text, <body>, <p>, <blockquote>, <main>,
```

------
Document converter:
select output
    font, fontsize, font-color(or rather, base color before methods above are applied)
document preview (oh damn holy shit what the fuck, not in the first version, dog!)
    (could just preview one line of text for adjusting the font?)
Output:
    .txt
    other options?
        .pdf is likely doable
        .epub .mobi  <-- research
    TTS incorporated?  or just leave that to external software? (probable stick to text)