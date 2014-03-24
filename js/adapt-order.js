/*
* adapt-order
* License - http://github.com/martinsandberg/adapt_framework/LICENSE
* Maintainers - Martin Sandberg <martin.sandberg@xtractor.se>
*/

define(function (require) {
    var QuestionView = require('coreViews/questionView');
    var Adapt = require('coreJS/adapt');
    
    var myItemData = [];
    
    var Order = QuestionView.extend({
        events: {
            'click .order-up-icon':'moveAlternativeUp',
            'click .order-down-icon':'moveAlternativeDown',
            "click .order-widget .button.submit":"onSubmitClicked",
            "click .order-widget .button.reset":"onResetClicked",
            "click .order-widget .button.model":"onModelAnswerClicked",
            "click .order-widget .button.user":"onUserAnswerClicked",
            "blur input":"forceFixedPositionFakeScroll"
        },

        forceFixedPositionFakeScroll: function() {
            if (Modernizr.touch) {
                _.defer(function() {
                    window.scrollTo(document.body.scrollLeft, document.body.scrollTop);
                });
            } 
        },

       /*
         canSubmit:function() {
            var canSubmit = true;
            this.$(".order-item-textbox").each(function() {
                if($(this).val()=="") {
                    canSubmit = false;
                }
            });
            return canSubmit;
        },
        */
       /*
        checkAnswerIsCorrect: function(possibleAnswers, userAnswer) {
            var answerIsCorrect = _.contains(possibleAnswers, this.cleanupUserAnswer(userAnswer));
            if(answerIsCorrect) this.model.set('_hasAtLeastOneCorrectSelection', true);
            return answerIsCorrect;
        },
         */
       /*
        cleanupUserAnswer: function(userAnswer) {
            if(this.model.get('_allowsAnyCase')) {
                userAnswer = userAnswer.toLowerCase();
            }
            if(this.model.get('_allowsPunctuation')) {
                var userAnswerClean = userAnswer.replace(/[\.,-\/#!$£%\^&\*;:{}=\-_`~()]/g,"");
                userAnswer = $.trim(userAnswerClean);
            }
            return userAnswer;
        },
         */
       /*
        forEachAnswer: function(callback) {
             _.each(this.model.get('items'), function(item, index) {
                if(this.model.get('_allowsAnyOrder')) {
                    this.$(".order-item-textbox").each($.proxy(function(index, element) {
                        var userAnswer = $(element).val();
                        callback(this.checkAnswerIsCorrect(item.answers, userAnswer), item);
                    },this));
                } else {
                    var userAnswer = this.$(".order-item-textbox").eq(index).val();
                    callback(this.checkAnswerIsCorrect(item.answers, userAnswer), item);
                }
            }, this);
        },
         */
       /*
        markQuestion: function() {
            this.forEachAnswer(function(correct, item) {
                item.correct = correct;
            });
            QuestionView.prototype.markQuestion.apply(this);
        },
         */
       /*
        onEnabledChanged: function() {
            this.$('.order-item-textbox').prop('disabled', !this.model.get('_isEnabled'));
        },
         */
       /*
        onModelAnswerShown:function () {
            _.each(this.model.get('items'), function(item, index){
                this.$(".order-item-textbox").eq(index).val(item.answers[0]);
            }, this);
        },
         */
       /*
        onUserAnswerShown:function () {
            _.each(this.model.get('items'), function(item, index){
                this.$(".order-item-textbox").eq(index).val(item.userAnswer);
            }, this);
        },
         */
        
        //+ Jonas Raoni Soares Silva
        //@ http://jsfromhell.com/array/shuffle [v1.0]
        shuffle: function (o){ //v1.0
            for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
            return o;
        },
        
        moveAlternativeUp: function(event) {
            event.preventDefault();
            var inIndex = $(event.currentTarget).data('id');
            var upvalue = myItemData[inIndex];
            var downvalue = myItemData[inIndex-1];
            myItemData.splice(inIndex-1,1,upvalue); 
            myItemData.splice(inIndex,1,downvalue); 
            this.postanswers();
        },
        
        moveAlternativeDown: function(event) {
            event.preventDefault();
            var inIndex = $(event.currentTarget).data('id');
            var upvalue = myItemData[inIndex+1];
            var downvalue = myItemData[inIndex];
            myItemData.splice(inIndex,1,upvalue); 
            myItemData.splice(inIndex,1,downvalue); 
            this.postanswers();
        },
        
        randomzeAlternatives: function() {
             var myTempData = this.model.get('items');
           
            for (var i = 0; i < myTempData.length; i++) {
                myanswer = myTempData[i].answer;
                
                myItemData.push(myanswer);
            }
            
            this.shuffle(myItemData);
            
        },
        
        postanswers: function() {
            for (var i = 0; i < myItemData.length; i++) {
                myanswer = myItemData[i];
                
                this.$(".order-item-textbox").eq(i).val(myanswer);
                
            }
            
        },
        
        postRender: function() {
            this.randomzeAlternatives();
            this.postanswers();
            QuestionView.prototype.postRender.apply(this);
            this.setReadyStatus();
        },
        
        forEachAnswer: function(callback) {
           //alert("forEachAnswer " );
           // var myTempData = this.model.get('items');
            _.each(this.model.get('items'), function(item, index) {
                
               
                var useranswer =  myItemData[index];
                var corranswer = item.answer;
                
               // alert("Each useranswer = " + useranswer + " & corranswer = " +corranswer);
                
              var correctSelection = useranswer == corranswer;
              //  alert("correctSelection ("+correctSelection+") = item.answer ("+item.answer+") == myTempData[item.data('id')].answer ("+myTempData[item.data('id')].answer+")");
                if(correctSelection) {
                    this.model.set('_isAtLeastOneCorrectSelection', true);
                }
                callback(correctSelection, item);
            }, this);
        },

        markQuestion: function() {
              //  alert("markQuestion");
        	this.forEachAnswer(function(correct, item) {
                        //alert("Item found to be " + correct);
        		item.correct = correct;
        	});
        	QuestionView.prototype.markQuestion.apply(this);
        },
        
        onSubmitClicked: function(event) {
            QuestionView.prototype.onSubmitClicked.apply(this, arguments);
            this.markQuestion();
            /*
            var correct = true;
             for (var i = 0; i < myItemData.length; i++) {
                var myanswer = myItemData[i];
                
                var myTempData = this.model.get('items');
                 
                var corranswer = myTempData[i].answer;
                
              //  alert("checking answer '" + myanswer + "' against correct '" + corranswer + "'");
                if (myanswer === corranswer){
                    this.model.set('_isAtLeastOneCorrectSelection', true);
                } else {
                    item = myTempData[i];
                    this.model.set(item.correct, false);
                   // myTempData[i].correct = false;
                    correct = false;
                    
                }
                
            }
            if (correct){
                //this.model.set('_isAtLeastOneCorrectSelection', true);
            } else {
               // this.model.set('_isAtLeastOneCorrectSelection', true);
            }
            alert("The answers are '" + correct + "'");
            */
           // QuestionView.prototype.markQuestion.apply(this);
        
        }
        /*
        storeUserAnswer: function() {
            _.each(this.model.get('items'), function(item, index) {
                item.userAnswer = this.$('.order-item-textbox').eq(index).val();
            }, this);
        }
        */
    });
    
    Adapt.register("order", Order);
    
});