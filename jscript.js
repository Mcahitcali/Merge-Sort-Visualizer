$(document).ready(function () {
    var unsortedArray = [],
        state = "begin",
        timer = null, 
        interval = 1000,
        leftCount = 1,
        endLeftCount = 1,
        rightCount = 1,
        endRightCount = 1,
        resultCount = 1,
        endResultCount = 1;

    if (
        confirm(
            'Sıralamak istediğiniz sayıları rastgele oluşturmak için "TAMAM" butonuna,kendiniz girmek için "İPTAL" butonuna basınız.'
        )
    ) {
        var countVal = prompt(
            "1-100 arası kaç farklı sayıyı sıralamak istiyorsunuz? (Sınır 1-50)"
        );
        if (countVal > 1 && countVal < 51) {
            unsortedArray = randomArray(countVal);
        }
    } else {
        var values = prompt(
            "Lütfen sıralanmasını istediğiniz birbirinden farklı değerleri aralarında virgül olacak şekilde boşluk bırakmadan giriniz:"
        );
        var customArray = values.split(",").map(Number);
        unsortedArray = customArray;
    }

    function randomArray(length) {
        var arr = [];
        for (i = 0; i < length; i++) {
            arr[i] = 1 + Math.floor(Math.random() * (100 - 1));
        }
        return arr;
    }

    const head = document.getElementById("origin-array"), array = unsortedArray;
    createCircleDiv(head, array, "canvas");

    function createCircleDiv(parrentDiv, array, direction) {
        const colors = [
            ["#BEE3F7", "#45AEEA"],
            ["#37ff19", "#18ba00"],
            ["#ff4949", "#aa0101"]
        ];

        if (direction == "left") {
            color = colors[1];
        } else if (direction == "right") {
            color = colors[2];
        } else {
            color = colors[0];
        }
        var circlesDiv = document.createElement("div");
        circlesDiv.setAttribute("class", "circles");
        circlesDiv.setAttribute("id", "circles");

        if (direction != "canvas") {
            var child = document.createElement("div");
            child.className = direction;
            if (direction == "left") {
                child.setAttribute("id", direction + "-array-" + leftCount);
                leftCount += 1;
            } else if (direction == "right") {
                child.setAttribute("id", direction + "-array-" + rightCount);
                rightCount += 1;
            } else {
                child.setAttribute("id", direction + "-array-" + resultCount);
                resultCount += 1;
            }

            parrentDiv.appendChild(child);
            parrentDiv = child;
        }
        parrentDiv.appendChild(circlesDiv);

        for (var i = 0; i < array.length; i++) {
            var child = document.createElement("div");
            child.className = "circle";
            child.setAttribute("id", parrentDiv.id + "-circle-" + (i + 1));
            circlesDiv.appendChild(child);

            var circleText = array[i];

            createCircle(child, circleText, color);
        }
    }

    function createCircle(child, circleText, color) {
        Circles.create({
            id: child.id,
            radius: 40,
            value: 50,
            maxValue: 100,
            width: 10,
            text: circleText,
            colors: color,
            duration: 200
        });
    }

    // Merge Sort Implentation (Recursion)
    function mergeSort(unsortedArray, parent) {
        // No need to sort the array if the array only has one element or empty
        if (unsortedArray.length <= 1) {
            return unsortedArray;
        }
        // In order to divide the array in half, we need to figure out the middle
        const middle = Math.floor(unsortedArray.length / 2);

        // This is where we will be dividing the array into left and right
        const left = unsortedArray.slice(0, middle);
        const right = unsortedArray.slice(middle);

        createCircleDiv(parent, left, "left");
        createCircleDiv(parent, right, "right");

        var parents = parent.children;
        const newLeftParent = parents[1];
        const newRightParent = parents[2];

        console.log("Left:" + newLeftParent.id);
        console.log("right:" + newRightParent.id);

        console.log("Left:" + left);
        console.log("right:" + right);

        // Using recursion to combine the left and right
        return merge(
            mergeSort(left, newLeftParent),
            mergeSort(right, newRightParent),
            parent
        );
    }

    function merge(left, right, parent) {
        let resultArray = [],
            leftIndex = 0,
            rightIndex = 0;
        console.log(parent);
        // We will concatenate values into the resultArray in order
        while (leftIndex < left.length && rightIndex < right.length) {
            if (left[leftIndex] < right[rightIndex]) {
                resultArray.push(left[leftIndex]);
                leftIndex++; // move left array cursor
            } else {
                resultArray.push(right[rightIndex]);
                rightIndex++; // move right array cursor
            }
        }
        const result = resultArray
            .concat(left.slice(leftIndex))
            .concat(right.slice(rightIndex));

        createCircleDiv(parent, result, "result");

        // We need to concat here because there will be one element remaining
        // from either left OR the right
        return result;
    }
    var nextStep = function() {
        var leftDiv = $("#left-array-" + endLeftCount);
        var rightDiv = $("#right-array-" + endRightCount);
        var resultDiv = $("#result-array-" + endResultCount);
        if (leftDiv.length) {
            leftDiv.fadeIn("slow");
            endLeftCount += 1;
        }
        if (rightDiv.length) {
            rightDiv.fadeIn("slow");
            endRightCount += 1;
        }
        if (
            resultDiv.length &&
            (endLeftCount == leftCount && endRightCount == rightCount)
        ) {
            resultDiv.fadeIn("slow");
            endResultCount += 1;
        }
    }

    var previousStep = function () {
        var leftDiv = $("#left-array-" + (endLeftCount-1));
        var rightDiv = $("#right-array-" + (endRightCount-1));
        var resultDiv = $("#result-array-" + (endResultCount-1));
        if (leftDiv.length) {
            leftDiv.fadeOut("slow");
            endLeftCount -= 1;
        }
        if (rightDiv.length) {
            rightDiv.fadeOut("slow");
            endRightCount -= 1;
        }
        if (resultDiv.length && (endLeftCount == leftCount && endRightCount == rightCount)) {
            resultDiv.fadeOut("slow");
            endResultCount -= 1;
        }
    }

    $("#start").click(function () {
        if(state == "begin"){
            const canvas = document.getElementById("canvas");
            mergeSort(unsortedArray, canvas);
            state = "runing";
        }
        if (timer !== null) return;
        timer = setInterval(nextStep, interval);
    });
    $("#stop").click(function(){
        clearInterval(timer);
        timer = null
    });

    $("#forward").click(function () {
        nextStep();
        console.log("EndLeftCount: "+endLeftCount);
        console.log("endRightCount: "+endRightCount);
        console.log("endResultCount: "+endResultCount);
    });

    $("#backward").click(function () {
        previousStep();
        console.log("EndLeftCount: "+endLeftCount);
        console.log("endRightCount: "+endRightCount);
        console.log("endResultCount: "+endResultCount);
    });

    
});
