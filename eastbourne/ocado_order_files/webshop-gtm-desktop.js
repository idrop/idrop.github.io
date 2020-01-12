(function(Backbone){'use strict';Backbone.Webshop.mixins.getAnalyticsAttributesForProduct=function(fopData){var fopContext=Backbone.Wreqr.radio.channel('gtm').reqres.request('fopContext')||{};var listName=fopContext.pageType;var sectionTitle=fopData.section||listName;if(fopContext.useSectionTitleAsListName){listName=sectionTitle;}
return{sectionTitle:sectionTitle,pageType:fopContext.pageType,listName:listName};}})(Backbone);(function(Backbone){"use strict";Backbone.Webshop.mixins.getBulkAddsSourceName=function(source){var sourceName;switch(source){case'LIST':sourceName='Shopping list';break;case'PROMO':sourceName='Bundle items';break;case'ORDER':sourceName='Previous order';break;case'RECIPE':sourceName='Recipes';break;case'SUGGESTEDORDER':sourceName='Instant shop';break;}
return sourceName;}})(Backbone);(function(Backbone){'use strict';Backbone.Webshop.mixins.parseFormattedPrice=function(priceObject){function extractPriceFromPoundSymbol(priceWithCurrencySymbol){var priceWithPoundMatch=priceWithCurrencySymbol.match(/&pound;(.*)/);return priceWithPoundMatch!=null&&priceWithPoundMatch.length>1?priceWithPoundMatch[1]:null;}
function extractPriceFromPenceSymbol(priceWithCurrencySymbol){var priceWithPenceMatch=priceWithCurrencySymbol.match(/([0-9]+)p$/);if(priceWithPenceMatch!=null&&priceWithPenceMatch.length>1){if(priceWithPenceMatch[1].length==1){return'0.0'+priceWithPenceMatch[1];}else{return'0.'+priceWithPenceMatch[1];}}else{return null;}}
var priceWithCurrencySymbol=priceObject.currentPrice;if(!priceWithCurrencySymbol){return undefined;}
var priceWithoutPoundSymbol=extractPriceFromPoundSymbol(priceWithCurrencySymbol);if(priceWithoutPoundSymbol!=null){return stringToNumber(priceWithoutPoundSymbol);}else{var priceWithoutPenceSymbol=extractPriceFromPenceSymbol(priceWithCurrencySymbol);if(priceWithoutPenceSymbol!=null){return stringToNumber(priceWithoutPenceSymbol);}else{return stringToNumber(priceWithCurrencySymbol);}}};function stringToNumber(str){if(str==null||str.length==0||isNaN(str)){return null;}else{return Number(str);}}})(Backbone);(function(Backbone,ocBackbone,webshop,_){'use strict';var basketFillingEventSenderInstance;var BasketFillingEventSender=Backbone.Marionette.Object.extend({_thresholds:[10.00,40.00],_lastReportBasketValue:0,initialize:function(){webshop.gtm.registerEventSource(this);},resetBasketValue:function(basketValue){this._lastReportBasketValue=basketValue;},reportBasketUpdate:function(newBasketValue){_.each(this._thresholds,function(threshold){if(this._lastReportBasketValue<threshold&&newBasketValue>=threshold){this._sendBasketFillingEvent(threshold,newBasketValue);}},this);this._lastReportBasketValue=newBasketValue;},_sendBasketFillingEvent:function(threshold,basketValue){this.trigger('gtm:uaEvent',{category:'Basket Filling',action:'Threshold Reached',label:threshold,value:basketValue});}});ocBackbone.gtm=ocBackbone.gtm||{};ocBackbone.gtm.BasketFillingEventSender={getInstance:function(){if(_.isUndefined(basketFillingEventSenderInstance)){basketFillingEventSenderInstance=new BasketFillingEventSender();}
return basketFillingEventSenderInstance;}};})(Backbone,ocBackbone,webshop,_);(function(Backbone,jQ,ocBackbone,webshop){'use strict';ocBackbone.gtm=ocBackbone.gtm||{};ocBackbone.gtm.LoginEventSender=Backbone.Marionette.Object.extend({initialize:function(){webshop.gtm.registerEventSource(this);},sendLoginEvents:function(loginSource,loginType,client){this.trigger('gtm:login',loginSource,client);this.trigger('gtm:loginType',loginSource,loginType);}});jQ(document).ready(function(){var loginType=webshop.common.jsVariables.get('gaLoginType');if(loginType){var devices=navigator.userAgent.match(/(iPhone|iPad|Android)/);var client=devices?devices[0]:'Desktop';var eventSender=new ocBackbone.gtm.LoginEventSender();var action='';switch(loginType){case'FACEBOOK':action='Facebook';break;case'PAYPAL':action='Paypal';break;default:action='Normal';break;}
eventSender.sendLoginEvents('Webshop',action,client);}});})(Backbone,jQ,ocBackbone,webshop);(function(Backbone){'use strict';ocBackbone.gtm=ocBackbone.gtm||{};ocBackbone.gtm.OrderStatusEventTracker=Backbone.Marionette.Object.extend({initialize:function(){webshop.gtm.registerEventSource(this);},trackOrderStatusEvent:function(orderStatusDescription){if(orderStatusDescription){this.trigger('gtm:orderStatus',orderStatusDescription);}}});})(Backbone);(function(Backbone){'use strict';ocBackbone.gtm=ocBackbone.gtm||{};ocBackbone.gtm.PromotionImpressionEventSender=Backbone.Marionette.Object.extend({initialize:function(){webshop.gtm.registerEventSource(this);},sendImpressions:function(promotions){sendPromotionImpression.call(this,promotions);}});function sendPromotionImpression(promotionImpressions){this.trigger('gtm:promotionImpressions',promotionImpressions,webshop.common.jsVariables.get('maxImpressions'));}})(Backbone,webshop);(function(Backbone){'use strict';ocBackbone.gtm=ocBackbone.gtm||{};ocBackbone.gtm.ORSignUpTracker=Backbone.Marionette.Object.extend({initialize:function(){webshop.gtm.registerEventSource(this);this.ORResponisveEnabled=Backbone.Webshop.mixins.isBetaFeatureEnabled('OR_RESPONSIVE_SIGN_UP');},trackLandingOnSignUpPage:function(isWithIncentive){this._triggerORSignUpPageEvent(isWithIncentive?'Has the incentive':'Does not have the incentive');},trackLandingOnOldSignUpPage:function(isMobileRequested){this._triggerORSignUpPageEvent(isMobileRequested?'Mobile phone requested':'Mobile phone not requested');},trackOldORMbilePhoneError:function(){this._triggerORSignUpPageEvent('Error on reserve click');},trackOldORSignUpClick:function(){this._triggerORSignUpPageEvent('Reserve button clicked');},trackTryItNowButtonClick:function(isBottomButton){this._triggerORSignUpPageEvent(isBottomButton?'Bottom CTA clicked':'Top CTA clicked');},trackScrolledToBottomEvent:function(){this._triggerORSignUpPageEvent('Scrolled to bottom');},trackTCClick:function(){this._triggerORSignUpPageEvent('T&C clicked');},trackFAQClick:function(){this._triggerORSignUpPageEvent('FAQ clicked');},trackLandingOnBookSlotPage:function(hasMultipleDeliveryAddresses){this._triggerORBookSlotPageEvent(hasMultipleDeliveryAddresses?'Has multiple delivery addresses':'Has single delivery address');},trackDeliveryAddressChange:function(){this._triggerORBookSlotPageEvent('Delivery address changed');},trackManageAddressesClick:function(){this._triggerORBookSlotPageEvent('Manage addresses clicked');},trackDeliveryAddressConfirm:function(isPrimary){this._triggerORBookSlotPageEvent(isPrimary?'Primary delivery address selected':'Other delivery address selected');},trackDaySelection:function(selectedDay){var availableDays=['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];if(availableDays.indexOf(selectedDay)<0){throw'Day is incorrect. Must be one of: Mon, Tue, Wed, Thu, Fri, Sat, Sun';}
this._triggerORBookSlotPageEvent('Day selected: '+selectedDay);},trackFrequencySelect:function(selectedFrequency){var availableFrequencies=['WEEKLY','TWO_WEEKLY'];if(availableFrequencies.indexOf(selectedFrequency)<0){throw'Frequency is incorrect. Must be one of: Weekly, Every 2 weeks';}
this._triggerORBookSlotPageEvent('Frequency selected: '+selectedFrequency);},trackTimeSlotsDisplay:function(){this._triggerORBookSlotPageEvent('Time slots displayed');},trackTimeSlotSelect:function(timeSlot){if(!timeSlot){throw'Time Slot is a required parameter';}
this._triggerORBookSlotPageEvent('Time slot selected: '+timeSlot);},trackItemsInOrderConfirm:function(){this._triggerORBookSlotPageEvent('Items in order confirmed');},trackSMSRemindersDisplay:function(){this._triggerORBookSlotPageEvent('SMS Reminders box displayed');},trackPhoneNumberConfirmClick:function(){this._triggerORBookSlotPageEvent('Phone number confirm clicked');},trackPhoneNumberError:function(){this._triggerORBookSlotPageEvent('Phone number confirmation error');},trackPhoneNumberSuccess:function(){this._triggerORBookSlotPageEvent('Phone number confirmation success');},trackBookSlotConfirmClick:function(){this._triggerORBookSlotPageEvent('Confirm and continue clicked');},trackLandingOnPaymentsPage:function(){this._triggerORPaymentsPageEvent('Landed on payments page');},trackPaymentMethodSubmit:function(method){var availableMethods=['Pay Pal','New Card','Stored Card'];if(availableMethods.indexOf(method)<0){throw'Payment method is incorrect. Must be one of: Pay Pal, New Card, Stored Card';}
this._triggerORPaymentsPageEvent('Payment method submitted: '+method);},trackLandingOnSettingsPage:function(){this._triggerORSettingsPageEvent('Landed on settings page');},trackSettingsPageUnavailableSlotInfo:function(){this._triggerORSettingsPageEvent('Informed about unavailable slot');},trackSettingsPageUnavailableItemsInfo:function(){this._triggerORSettingsPageEvent('Informed about unavailable items');},_triggerORSignUpPageEvent:function(action){this._triggerORPageEvent('Sign Up Page',action);},_triggerORBookSlotPageEvent:function(action){this._triggerORPageEvent('Book Slot Page',action);},_triggerORPaymentsPageEvent:function(action){this._triggerORPageEvent('Payments Page',action);},_triggerORSettingsPageEvent:function(action){this._triggerORPageEvent('Settings Page',action);},_triggerORPageEvent:function(label,action){var eventData={category:this.ORResponisveEnabled?'OR':'OR Old',label:label,action:action};this.trigger('gtm:uaEvent',eventData);}});})(Backbone);(function(Backbone,ocBackbone,webshop,jQ,_){'use strict';jQ(function(){var basketFillingEventSender=ocBackbone.gtm.BasketFillingEventSender.getInstance();if(webshop.basketSummaryData&&webshop.basketSummaryData.total){basketFillingEventSender.resetBasketValue(Backbone.Webshop.mixins.parseFormattedPrice({currentPrice:webshop.basketSummaryData.total}));}
document.observe('webshop:basket:update',function(event){var jsonData=event.memo.data;if(jsonData&&!_.isEmpty(jsonData.total)){basketFillingEventSender.reportBasketUpdate(Backbone.Webshop.mixins.parseFormattedPrice({currentPrice:jsonData.total}));}});})})(Backbone,ocBackbone,webshop,jQ,_);(function(Backbone,_,ocBackbone,webshop,jQ){'use strict';Backbone.Webshop=Backbone.Webshop||{};Backbone.Webshop.gtm=Backbone.Webshop.gtm||{};Backbone.Webshop.gtm.BatchTrolleyEventTracker=Backbone.Marionette.Object.extend({initialize:function(){if(Backbone.Webshop.mixins.isBetaFeatureEnabled('GOOGLE_ANALYTICS_BATCH_ACTIONS')&&webshop.basketSummaryData&&webshop.basketSummaryData.bulkAddsSource){var products=_.map(webshop.basketSummaryData.bulkAddsSkusWithQuantity,function(quantity,sku){var item=_.findWhere(webshop.basketSummaryData.items,{sku:sku});return{id:item.sku,name:item.encodedName,brand:item.brand?item.brand:null,price:Backbone.Webshop.mixins.parseFormattedPrice({currentPrice:item.itemCataloguePrice}),category:item.category,quantity:quantity};});var eventSender=new ocBackbone.gtm.TrolleyEventSender();eventSender.batchAddToTrolley(products,webshop.basketSummaryData.bulkAddsSource);}},});jQ(document).ready(function(){webshop.gtm.batchTrolleyEventTracker=new Backbone.Webshop.gtm.BatchTrolleyEventTracker();});})(Backbone,_,ocBackbone,webshop,jQ);(function(Backbone){'use strict';ocBackbone.gtm=ocBackbone.gtm||{};ocBackbone.gtm.ProductImpressionEventSender=Backbone.Marionette.Object.extend({initialize:function(){webshop.gtm.registerEventSource(this);},sendProductImpressionWithSectionAsListName:function(products,sectionTitle,pageType){sendProductImpression.call(this,products,sectionTitle,sectionTitle,pageType);},sendProductImpressionWithPageTypeAsListName:function(products,sectionTitle,pageType){sendProductImpression.call(this,products,sectionTitle,pageType,pageType);}});function sendProductImpression(products,sectionTitle,listName,pageType){this.trigger('gtm:productImpressions',{sectionTitle:sectionTitle,products:products,listName:listName,pageType:pageType},webshop.common.jsVariables.get('maxImpressions'));}})(Backbone,webshop);(function(Backbone,_,ocBackbone,webshop){'use strict';Backbone.Webshop.catalogue.GTMPromotionClickTracker=Backbone.Marionette.Object.extend({initialize:function(){if(webshop.common.jsVariables.get('gaTrackPromos')){webshop.gtm.registerEventSource(this);Backbone.$(document.body).on('click',"[data-element-type='promotion']",this.sendPromotionClickEvent.bind(this));}},sendPromotionClickEvent:function(event){var promo=Backbone.$(event.currentTarget);if(!_.isEmpty(promo)){var position=getPromoPosition(promo);this.trigger('gtm:promotionClick',{promo:{id:promo.attr('data-promotion-id'),name:promo.attr('data-promotion-name'),creative:promo.attr('data-promotion-creative'),position:position},pageType:getPageType(),sectionTitle:promo.attr('data-promotion-section')});}}});function getPromoPosition(promo){var promoPosition=promo.attr('data-promotion-position');if(Backbone.$.isNumeric(promoPosition)){if(promo.parents("#bopPopup").length){return null;}else{var extractedHeader=Backbone.$("#fopMetaData-"+promoPosition);var skuList=Backbone.$("[data-collection-name]");var index=skuList.index(extractedHeader);return index>=0?index:null;}}else{return promoPosition;}}
function getPageType(){if(Backbone.Webshop.mixins.isCheckout()){return'Checkout walk';}
var pageType=webshop.common.jsVariables.get('pageType');if(_.isEmpty(pageType)){return'Other';}else{return pageType;}}
Backbone.$(function(){if(webshop.common.jsVariables.get('gaTrackPromos')){ocBackbone.gtm=ocBackbone.gtm||{};ocBackbone.gtm.gtmPromotionClickTracker=ocBackbone.gtm.gtmPromotionClickTracker||new Backbone.Webshop.catalogue.GTMPromotionClickTracker();}});})(Backbone,_,ocBackbone,webshop);(function(Backbone){'use strict';ocBackbone.gtm=ocBackbone.gtm||{};ocBackbone.gtm.PromotionImpressionEventSender=Backbone.Marionette.Object.extend({initialize:function(){webshop.gtm.registerEventSource(this);},sendImpressions:function(promotions){sendPromotionImpression.call(this,promotions);}});function sendPromotionImpression(promotionImpressions){this.trigger('gtm:promotionImpressions',promotionImpressions,webshop.common.jsVariables.get('maxImpressions'));}})(Backbone,webshop);(function(Backbone,webshop,ocBackbone){'use strict';ocBackbone.gtm=ocBackbone.gtm||{};ocBackbone.gtm.TrolleyEventSender=Backbone.Marionette.Object.extend({initialize:function(){webshop.gtm.registerEventSource(this);},addToTrolley:function(productData,sectionTitle,pageType,listName){this.trigger('gtm:trolleyEvent','add',[productData],sectionTitle,pageType,listName);},removeFromTrolley:function(productData,sectionTitle,pageType,listName){this.trigger('gtm:trolleyEvent','remove',[productData],sectionTitle,pageType,listName);},clearTrolley:function(products,sectionTitle,pageType,listName){this.trigger('gtm:trolleyEvent','remove',products,sectionTitle,pageType,listName);},batchAddToTrolley:function(products,source){var sourceName=Backbone.Webshop.mixins.getBulkAddsSourceName(source);this.trigger('gtm:trolleyEvent','add',products,sourceName,sourceName,sourceName);},});})(Backbone,webshop,ocBackbone);(function(Backbone,_,ocBackbone,webshop,jQ){'use strict';var NO_SECTION='NO_SECTION';Backbone.Webshop=Backbone.Webshop||{};Backbone.Webshop.gtm=Backbone.Webshop.gtm||{};Backbone.Webshop.gtm.PromotionImpressionsTracker=Backbone.Marionette.Object.extend({initialize:function(){if(webshop.common.jsVariables.get('gaTrackPromos')){this.processedItems=[];this.pageType=webshop.common.jsVariables.get('pageType');this.eventSender=new ocBackbone.gtm.PromotionImpressionEventSender();this.registerListenerForInfiniteScrolling();this.sendPromotionImpressionsData();}},sendPromotionImpressionsData:function(container,pageType){var promotions=this.detectPromotions(container instanceof jQ.Event?undefined:container);this.sendImpressionsData(this.eventSender,promotions,pageType);},detectPromotions:function(container){var promotions=jQ("[data-element-type='promotion']",container);var promotionsFiltered=this.filterPromotionsThatShouldNotBeTracked(promotions);return this.groupPromotionsByHeader(promotionsFiltered,container);},filterPromotionsThatShouldNotBeTracked:function(promotions){return _.filter(promotions,function(promotion){return!jQ(promotion).is(':hidden');});},groupPromotionsByHeader:function(promotions,container){var groupedPromotions={};_.each(promotions,function(promotion){var position=promotion.getAttribute('data-promotion-position');if(!jQ.isNumeric(position)){position+=promotion.getAttribute('data-promotion-id');}
if(this.processedItems.indexOf(position)===-1||container){var promoImpression={id:promotion.getAttribute('data-promotion-id'),name:promotion.getAttribute('data-promotion-name'),creative:promotion.getAttribute('data-promotion-creative')};var extractedHeader=promotion.getAttribute('data-promotion-section');if(!container){if(!extractedHeader&&jQ.isNumeric(position)){extractedHeader=this.extractHeader(position);addPromoImpressionPosition(promoImpression,position);}else{promoImpression.position=promotion.getAttribute('data-promotion-position');}}
addToHeaderGroup(groupedPromotions,extractedHeader,promoImpression);this.processedItems.push(position);}},this);return groupedPromotions;},sendImpressionsData:function(eventSender,groupedPromos,pageType){_.each(groupedPromos,function(productsInSingleSection,sectionTitle){if(productsInSingleSection.length>0){var impressions={promotions:productsInSingleSection,pageType:pageType?pageType:this.pageType};if(sectionTitle!=NO_SECTION){impressions.sectionTitle=sectionTitle;impressions.productSectionDimension=sectionTitle;}else{impressions.sectionTitle=pageType?pageType:this.pageType;}
eventSender.sendImpressions(impressions);}},this);},registerListenerForInfiniteScrolling:function(){jQ(document.body).on('webshop:gtm:newProductsLoaded',jQ.proxy(this.sendPromotionImpressionsData,this));},extractHeader:function(sku){var extractedHeader=jQ("#fopMetaData-"+sku);if(extractedHeader&&extractedHeader.attr('data-collection-name')){return extractedHeader.attr('data-collection-name');}else{extractedHeader=this.extractHeaderForProduct(sku);return extractedHeader.isClusterHeader?this.pageType:extractedHeader.value;}},extractHeaderForProduct:function(sku){var foundHeader={};var foundClusterHeader=this.extractHeaderBySelector("#fopMetaDataClusterHeader-"+sku);if(!_.isUndefined(foundClusterHeader)){foundHeader.value=foundClusterHeader;foundHeader.isClusterHeader=true;}else{foundHeader.value=this.extractHeaderBySelector("#fopMetaDataHeader-"+sku);if(!foundHeader.value){foundHeader.value=this.extractPrevHeader("fopMetaDataHeader-",sku);}}
return foundHeader;},extractPrevHeader:function(fopHeaderId,sku){var fopHeader;var prevs=jQ("#productDetails-"+sku).prevAll("li");var fopHeaderElement=_.find(prevs,function(prev){var header=jQ("[id^='"+fopHeaderId+"']",prev).first().html();if(header){return header;}});if(!_.isUndefined(fopHeaderElement)){fopHeader=this.extractHeaderBySelector("[id^='fopMetaDataHeader-']",fopHeaderElement);}else{fopHeader=this.extractHeaderBySelector("h2 span",jQ("#productDetails-"+sku).prevAll("li").last());}
return fopHeader;},extractHeaderBySelector:function(selector,context){var fopHeader=jQ(selector,context).first().html();if(!_.isUndefined(fopHeader)){fopHeader=fopHeader.trim().replace(/&nbsp;/g,'');}
return fopHeader;}});function addPromoImpressionPosition(promoImpression,sku){var extractedHeader=jQ("#fopMetaData-"+sku);var skuList=jQ("[data-collection-name]");var position=skuList.index(extractedHeader);if(position>=0){promoImpression.position=position;}}
function addToHeaderGroup(groupedProducts,header,promo){if(!header){header=NO_SECTION;}
if(_.isUndefined(groupedProducts[header])){groupedProducts[header]=[];}
groupedProducts[header].push(promo)}
jQ(document).ready(function(){webshop.gtm.PromotionImpressionsTracker=new Backbone.Webshop.gtm.PromotionImpressionsTracker();});})(Backbone,_,ocBackbone,webshop,jQ);