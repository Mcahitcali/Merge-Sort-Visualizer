$(document).ready(function () {
    //#region variables
    var unsortedArray = [],
        state = "begin",
        timer = null, 
        interval = 1000,
        step = 1;
        leftCircles = [],
        rightCircles = [],
        leftCount = 1,
        endLeftCount = 1,
        rightCount = 1,
        endRightCount = 1,
        resultCount = 1,
        endResultCount = 1;

    //#endregion

    // $("#interval-slider").slider();
    // $("#interval-slider").on("slide", function(slider){
    //     interval = slider.value;
    // })

    //#region  askArrayData
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
            $("#pseudo-text").text("unsortedArray = randomArray(); //Create array");
        }
    } else {
        var values = prompt(
            "Lütfen sıralanmasını istediğiniz birbirinden farklı değerleri aralarında virgül olacak şekilde boşluk bırakmadan giriniz:"
        );
        var customArray = values.split(",").map(Number);
        unsortedArray = customArray;
        $("#pseudo-text").text("unsortedArray = customArray; //Create array");
    }

    function randomArray(length) {
        var arr = [];
        for (i = 0; i < length; i++) {
            arr[i] = 1 + Math.floor(Math.random() * (100 - 1));
        }
        return arr;
    }
    //#endregion

    //#region Visualizer
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
        circle = Circles.create({
            id: child.id,
            radius: 40,
            value: 50,
            maxValue: 100,
            width: 10,
            text: circleText,
            colors: color,
            duration: 200
        });
        // console.log(child.id);
        // circles.push(circle);
     }

     var showCircle = function(div, opacity){
        var circlesDiv = div.children()[0];
        Array.from(circlesDiv.children).forEach(function(circle, index){
            
            var element = $("#"+circle.id);
            if (div[0].id.includes('result')){
                // var paths = element.find("path");
                // paths[0].setAttribute("stroke","#f6e79c");
                // paths[1].setAttribute("stroke","#f7ff56");
                element.animate({opacity: opacity}).fadeOut(250).fadeIn(750);
            }
            element.animate({
                opacity: opacity
               },interval);
        })

    }

    var pseudoAnimate = function(step){
        $(".bg-success").each(function( index ) {
            $( this ).removeClass("bg-success");
          });
        $("#"+step).addClass("bg-success");
    }
    //#endregion

    //#region Merge Sort Implentation (Recursion)
    function mergeSort(unsortedArray, parent) {
        // Dizi tek elemanli ise siralamaya gerek yok 
        if (unsortedArray.length <= 1) {
        return unsortedArray;
        }

        const middle = Math.floor((unsortedArray.length) / 2);
        const left = unsortedArray.slice(0, middle);
        const right = unsortedArray.slice(middle);
        var parents, newLeftParent, newRightParent;
        
        if(parent=="header"){ //ilk eleman girisi ise sag veya sol header divlerine ekle degilse diger alt divlere ekle 
            const leftHeader = document.getElementById("left-head"),
                    rightHeader = document.getElementById("right-head");

            createCircleDiv(leftHeader, left, "left");
            createCircleDiv(rightHeader, right, "right");

            newLeftParent = leftHeader.children[0];
            newRightParent = rightHeader.children[0];
        }
        else{
            createCircleDiv(parent, left, "left");
            createCircleDiv(parent, right, "right");

            parents = parent.children;
            newLeftParent = parents[1];
            newRightParent = parents[2];
        }
        

        // console.log("Left:" + newLeftParent.id);
        // console.log("right:" + newRightParent.id);

        // console.log("Left:" + left);
        // console.log("right:" + right);

        // sag ve sol iki diziyi de kendi icinde siralamak icin merge fonksiyonuna gonder
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
        // We need to concat here because there will be one element remaining
        // from either left OR the right
        const result = resultArray
            .concat(left.slice(leftIndex))
            .concat(right.slice(rightIndex));

        if(parent == "header"){
            parent = document.getElementById("result-head");
        }
        createCircleDiv(parent, result, "result");

        return result;
    }

    //#endregion
    
    //#region step settings
    var nextStep = function() {
        var leftDiv = $("#left-array-" + endLeftCount);
        var rightDiv = $("#right-array-" + endRightCount);
        var resultDiv = $("#result-array-" + endResultCount);
        if (
            resultDiv.length &&
            (endLeftCount == leftCount && endRightCount == rightCount)
        ) {
            const parent = resultDiv.parent()[0];
            if (parent.id.indexOf("result-head") >=0){
                stopStep();
                pseudoAnimate("step-3");
                $("#start").attr("disabled", true);
                $("#forward").attr("disabled", true);
            }
            else{
                pseudoAnimate("step-2");
            }
            showCircle(resultDiv,1);
            endResultCount += 1;
        }
        if (leftDiv.length) {
            pseudoAnimate("step-1");
            showCircle(leftDiv,1);
            endLeftCount += 1;
        }
        if (rightDiv.length) {
            pseudoAnimate("step-1");
            showCircle(rightDiv,1);
            endRightCount += 1;
        }

    }

    var previousStep = function () {
        var leftDiv = $("#left-array-" + (endLeftCount-1));
        var rightDiv = $("#right-array-" + (endRightCount-1));
        var resultDiv = $("#result-array-" + (endResultCount-1));

        if (resultDiv.length && (endLeftCount == leftCount && endRightCount == rightCount)) {
            showCircle(resultDiv,0);
            pseudoAnimate("step-2");
            endResultCount -= 1;
        }else{

            if (rightDiv.length) {
                pseudoAnimate("step-1");
                showCircle(rightDiv,0);
                endRightCount -= 1;
            }

            if (leftDiv.length) {
                pseudoAnimate("step-1");
                showCircle(leftDiv,0);
                endLeftCount -= 1;
            }
        }

    }

    var stopStep = function(){
        $("#start").text("Devam Et");
        $("#start").attr("disabled", false);
        $("#restart").attr("disabled", false);
        $("#forward").attr("disabled", false);
        $("#backward").attr("disabled", false);
        $("#stop").attr("disabled", true);

        clearInterval(timer);// intervali sil
        timer = null;
    }

    var resetStep = function(){
        $(".left").remove();
        $(".right").remove();
        $(".result").remove();
        $("#start").text("basla");
        $("#start").attr("disabled", false);
        $("#forward").attr("disabled", true);
        $("#backward").attr("disabled", true);
        $("#stop").attr("disabled", true);
        $("#restart").attr("disabled", true);
        
        state = "begin";
        clearInterval(timer);
        timer = null;
    }
    //#endregion


    //#region buttons funcs
    $("#start").click(function () {
        if(state == "begin"){
            mergeSort(unsortedArray,"header");
            state = "runing";
        }
        if (timer !== null) return;
        
        timer = setInterval(nextStep, (interval+1000)); // 1500(interval) salise araligi ile fonksiyonu tekrarla
        
        $("#restart").attr("disabled", false);
        $("#stop").attr("disabled", false);
        $("#start").attr("disabled", true);
    });

    $("#stop").click(function(){
        stopStep();
    });

    $("#forward").click(function () {
        $("#start").attr("disabled", false);
        nextStep();
    });

    $("#backward").click(function () {
        previousStep();
        $("#forward").attr("disabled",false);
    });

    $("#restart").click(function(){
        state = "begin";
        timer = null;
        interval = 1000;
        leftCount = 1;
        endLeftCount = 1;
        rightCount = 1;
        endRightCount = 1;
        resultCount = 1;
        endResultCount = 1;

        resetStep();
    });

    //#endregion
});
