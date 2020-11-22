
class App {
    constructor() {
        this.allColumns = [];
        this.isSorting = false;
        this.isRunning = false;
        this.speed = 50;
    }

    createRandomList() {
        this.allColumns = [];
        for (let i = 0; i < Math.floor(screen.width*0.8 / 15)-1; i++) {
            this.allColumns.push(new Column(Math.floor(Math.random() * 400)+1));
        }
    }
    
    draw() {
        var updateStringHTMLColumn = "";
        for (let i = 0; i < this.allColumns.length; i++) {
            updateStringHTMLColumn += this.allColumns[i].toHTMLColumn();
        }
        document.getElementById("all-columns").innerHTML = updateStringHTMLColumn;
    }

    async showCompletedAnimation() {
        for (let i = 0; i < this.allColumns.length; i++) {
            this.allColumns[i].setBackgroundColor("green");
            this.draw();
            await sleep(50);
        }
        
        for (let i = 0; i < this.allColumns.length; i++) {
            this.allColumns[i].setBackgroundColor("blue");
            this.draw();
            await sleep(50);
        }
    }
    
    async sortAnimated() {
        if (!this.isRunning) {
            var n = this.allColumns.length;
            var swapped = true;
            var x = -1;
        
            this.isSorting = true;
            this.isRunning = true;

            while (swapped && this.isSorting) {
                swapped = false;
                x += 1;
                var max = 0;
                for (let i = 1; i < n-x; i++) {
                    if (this.allColumns[i-1].height > this.allColumns[i].height) {
                        this.allColumns[i].setBackgroundColor("red");
                        this.allColumns[i-1].setBackgroundColor("red");
                        this.draw();
                        await sleep(200 - (this.speed * 2));
                        const holder = this.allColumns[i];
                        this.allColumns[i] = this.allColumns[i-1];
                        this.allColumns[i-1] = holder;
                        swapped = true;
                    }
                    this.allColumns[i-1].setBackgroundColor("blue");
                    this.draw();
                    max = i;
                }
                this.allColumns[max].setBackgroundColor("blue");
            }
            if (!swapped)
                this.showCompletedAnimation();
            this.isSorting = false;
            this.isRunning = false;
        }
    }

    reset() {
        this.isSorting = false;
        this.isRunning = false;
        this.allColumns = [];
        this.draw();
    }

    pause() {
        this.isSorting = false;
    }

    continue() {
        if (!this.isSorting)
            this.sortAnimated();
    }
}

class Column {
    constructor(height) {
        this.height = height;
        this.backgroundColor = "blue";
    }

    setBackgroundColor(newBackgroundColor) {
        this.backgroundColor = newBackgroundColor;
    }

    toHTMLColumn() {
        return '<div class="column" id="' + this.height + '" style="height: ' + this.height + 'px; margin-top: ' + (420 - this.height) + 'px; background-color: ' + this.backgroundColor + '"></div>';
    }
}

const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const app = new App();

document.getElementById("start").addEventListener('click', () => {
    if (document.getElementById("start").innerHTML == "Start") {
        if (!app.isSorting) {
            app.createRandomList();
            app.sortAnimated();
        }
        document.getElementById("start").innerHTML = "Reset";
    } else {
        app.reset();
        document.getElementById("start").innerHTML = "Start";
    }
});

document.getElementById("pause").addEventListener('click', () => app.pause());

document.getElementById("continue").addEventListener('click', () => app.continue());

document.getElementById("speed").oninput = function() {
    app.speed = this.value;
}