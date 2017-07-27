const {defineSupportCode} = require('cucumber');
const helpers = require('../helpers/helpers');
const Journey = require('../page-objects/journey-planner/plan-journey');
const TravelAdvice = require('../page-objects/travel-advice/travel-advice');
const TravelPossibilities = require('../page-objects/travel-advice/ui/travel-possibilities.page');
const TravelDetails = require('../page-objects/travel-advice/ui/travel-details.page');

defineSupportCode(({Given, When, Then}) => {
    const journey = new Journey();
    const travelAdvice = new TravelAdvice();
    const travelDetails = new TravelDetails();
    const travelPossibilities = new TravelPossibilities();

    Given('{someone} opens the journey planner from the NS', (someone) => {
        return browser.get('en/journeyplanner/#/')
            .then(() => helpers.acceptCookies())
            .then(() => helpers.lockHeader());
    });

    When('he plans a journey from {fromStation} to {toStation} on {date} at {time}', (fromStation, toStation, date, time) => {
        return journey.plan({
            from: fromStation,
            to: toStation,
            on: date,
            at: time
        });
    });

    Then('he should see the trains departing at {suggestedTimes}', (suggestedTimes) => {
        return expect(travelAdvice.getSuggestedTravelTimes()).to.eventually.equal(suggestedTimes);
    });

    Then('he should see the preselected journey will leave at {departureTime} from platform {platform} and costs € {amount} for a single way {travelClass} class ticket',
        (departureTime, platform, amount, travelClass) => {
            return travelAdvice.getSelectedDepartureTimePlatformPriceTravelClass()
                .then((result) => {
                    expect(result.departureTime).to.equal(departureTime);
                    expect(result.departurePlatform).to.contains(platform);
                    expect(result.price).to.contains(amount);
                    return expect(result.travelClass).to.contains(travelClass);
                });
        });
});