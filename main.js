(function(g, doc) {
    var textArea = doc.getElementById("codeinput"),
        charEle = doc.getElementById("charcount"),
        byteEle = doc.getElementById("bytecount"),
        lastCount = '';


    function count() {
        var input = textArea.value,
            end = input.length,
            output = [],
            idx = 0,
            inComment = false,
            chr,
            chrCode,
            prevChr,
            nextChr;

        if (lastCount === input) {
            return;
        }
        lastCount = input;
        while (idx < end) {
            chr = input[idx];
            chrCode = input.charCodeAt(idx);


            if (chrCode >= 55296 && chrCode <= 56319 && idx < end && (input.charCodeAt(idx + 1) & 64512) == 56320) {
                idx += 1;
                if (!inComment) {
                    output.push(chr + input[idx]);
                }

            } else {
                prevChr  = output[output.length -1] || '';
                chr      = chr === '\r' ? '\n' : chr;
                nextChr = input[idx + 1] || '';


                // character is a linebreak
                if (chr === '\n') {

                    // if in a comment, unset comment flag
                    if (inComment) {
                        inComment = false;

                    } else if (output.length && prevChr !== '\n') {
                        if (prevChr === ' ') {
                            output.pop();
                        }
                        output.push('\n');
                    }

                // not in a comment section
                } else if (!inComment) {


                    // character that aren't: / | ; space
                    if (!/[\/|; ]/.test(chr)) {
                        output.push(chr);

                    // character is ';'
                    } else if (chr === ';') {
                        if (!output.length || prevChr === '\n') {
                            inComment = true;
                        } else {
                            output.push(';');
                        }

                    // character is '/'
                    } else if (chr === '/' && (!output.length || (output.length && prevChr !== '\n'))) {
                        output.push('/');


                    // character is '|'
                    } else if (chr === '|') {
                        if ((!output.length || /[\n ]/.test(prevChr)) && (!nextChr.length || /[\n ]/.test(nextChr))) {
                            output.push('\n');
                        } else {
                            output.push('|');
                        }

                    // character is ' '
                    } else if (chr === ' ' && (!output.length || !/[\n ]/.test(prevChr)) && (!nextChr.length || !/[\n ]/.test(nextChr))) {
                        output.push(' ');
                    }
                }
            }
            idx += 1;
        }
        while (/[\n ]/.test(output[output.length -1] || '')) {
            output.pop();
        }
        charEle.innerText = output.length;
        byteEle.innerText = utf8.encode(output.join("")).length;
    }
    
    textArea.onkeyup = count;
    textArea.oninput = function() {
        textArea.onkeyup = null ;
        count()
    }
}(window, document));