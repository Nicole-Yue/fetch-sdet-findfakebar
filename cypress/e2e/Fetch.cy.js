//cypress - Spec , means the same files
/// <reference types="Cypress" />

//describe is the test suite level
describe('Fetch', function () {

    before(function () {
        cy.visit("http://sdetchallenge.fetch.com")
        cy.wait(2000)
    })

    it('Should See Proper Alert Message Baseed On User Selection', function () {
        let weights = [0, 1, 2, 3, 4, 5, 6, 7, 8]
        // enter first round weighing in the box
        enterWeights(weights)
        // perform 2 rounds og weighing and find the fake bar
        cy.get("button#weigh").click()
        cy.wait(2000)    
        findFakeGoldBar()
        // verify correct alert text on the pop up     
        cy.on('window:alert', (str) => {
            expect(str).to.equal('Yay! You find it!')
        })
    })

    function enterWeights(weights) {
        cy.get(".game-board").first()
            .find("input#left_0").type(weights[0])
        cy.get(".game-board").first()
            .find("input#left_1").type(weights[1])
        cy.get(".game-board").first()
            .find("input#left_2").type(weights[2])

        cy.get(".game-board").eq(1)
            .find("input#right_0").type(weights[3])
        cy.get(".game-board").eq(1)
            .find("input#right_1").type(weights[4])
        cy.get(".game-board").eq(1)
            .find("input#right_2").type(weights[5])
    }
    function findFakeGoldBar() {
        cy.get("ol").find("li").eq(0).invoke('text').then((text) => {
            let fakeBarGroup
            // Use a regular expression to capture the symbol (">" or "=" or "<")
            const regex1 = /[\d\]]\s*([>])\s*\[\d/
            const regex2 = /[\d\]]\s*([=])\s*\[\d/
            const regex3 = /[\d\]]\s*([<])\s*\[\d/
            const greaterThan = text.match(regex1)
            const equal = text.match(regex2)
            const lessThan = text.match(regex3)
            if (greaterThan) {
                // fake bar is at the second group [3,4,5] after first round of comparation
                fakeBarGroup = [3, 4, 5]
                resetScale()
                cy.get(".game-board").first()
                    .find("input#left_0").type(fakeBarGroup[0])
                cy.get(".game-board").eq(1)
                    .find("input#right_0").type(fakeBarGroup[1])
                cy.get("button#weigh").click();
                cy.wait(2000);
                getResult(fakeBarGroup)
            } else if (equal) {
                // fake bar is at the last group[6,7,8]
                fakeBarGroup = [6, 7, 8]
                resetScale()
                cy.get(".game-board").first()
                    .find("input#left_0").type(fakeBarGroup[0])
                cy.get(".game-board").eq(1)
                    .find("input#right_0").type(fakeBarGroup[1])
                cy.get("button#weigh").click()
                cy.wait(2000)
                getResult(fakeBarGroup)

            } else if (lessThan) {
                // fake bar is at the first group[0,1,2]
                fakeBarGroup = [0, 1, 2]
                resetScale()
                cy.get(".game-board").first()
                    .find("input#left_0").type(fakeBarGroup[0])
                cy.get(".game-board").eq(1)
                    .find("input#right_0").type(fakeBarGroup[1])
                cy.get("button#weigh").click()
                cy.wait(2000)
                getResult(fakeBarGroup)
            }
        })
    }
    function resetScale() {
        cy.get('button.button').eq(1).click();
    }
    function getButtonResult() {
        cy.get('button.button').eq(0).invoke('text').then((value) => {
            if (value.includes(">")) {
                cy.log("The fake bar number is: greater")
            } else if (value.includes("=")) {
                cy.log("The fake bar number is: equal")
            } else if (value.includes("<")) {
                cy.log("The fake bar number is: less")
            }
        })
    }
    function getResult(fakebarfinal) {
        // Use a regular expression to capture the symbol (">" or "=" or "<")       
        return cy.get("ol").find("li").eq(1).invoke('text').then((text) => {
            const regex1 = /[\d\]]\s*([>])\s*\[\d/
            const regex2 = /[\d\]]\s*([=])\s*\[\d/
            const regex3 = /[\d\]]\s*([<])\s*\[\d/
            const greaterThan = text.match(regex1)
            const equal = text.match(regex2)
            const lessThan = text.match(regex3)

            if (greaterThan) {
                // fake bar is at the second  [a,b,c] after first round of comparation      
                getButtonResult()
                cy.log("The fake bar number is: " + fakebarfinal[1])
                cy.get('#coin_' + fakebarfinal[1] + '').click()
            } else if (equal) {
                // fake bar is at the last  [a,b,c] after first round of comparation      
                getButtonResult()
                cy.log("The fake bar number is: " + fakebarfinal[2])
                cy.get('#coin_' + fakebarfinal[2] + '').click()
            } else if (lessThan) {
                // fake bar is at the first  [a,b,c] after first round of comparation      
                getButtonResult()
                cy.log("The fake bar number is: " + fakebarfinal[0])
                // click on the fake bar 
                cy.get('#coin_' + fakebarfinal[0] + '').click()
            }
        })
    }
})