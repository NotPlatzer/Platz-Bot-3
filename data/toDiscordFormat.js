

function toDiscordTextformat(text) {
    var array = [];
    const textlen = text.length / 2000;
    if (textlen < 1) {
        array.push(text);
        return array;
    } else {

        var bis = 2000;
        var von = 0;
        var c = 0;

        while (c <= textlen) {
            var done = false;
            //bis im string und don olm -1 bis " " oder , oder .
            while (done === false) {

                var reduced = 0;

                if (text.charAt(bis - 1) === " " || text.charAt(bis - 1) === "," || text.charAt(bis - 1) === "." || text.charAt(bis - 1) === "!" || text.charAt(bis - 1) === "?" || text.charAt(bis - 1) === "  ") {
                    bis--;
                    if (von !== 0) {
                        reduced--;
                    }
                    done = true;
                }
                else {
                    bis--;
                    if (von !== 0) {
                        reduced--;
                    }
                }
            }
            var cutoff = text.substring(von, bis);

            if (cutoff < 100) {

            } else {
                array.push(cutoff);
                c = c + 1;
                von = von + 2000 - reduced - 1;
                bis = bis + 2000;
                cutoff = 0;
            }
        }
    }
    return array;
}