$(function () {

    let mainTable = $('#main-table'),
        idCounter = 1;

    let getCriteriaTemplate = function (id) {
            return `<tr id="${id}">
                <td><input type="string" min="0" max="100"></td>
                <td>
                    <input type="number" class="note-input" min="0" max="100" step="10">
                    (<input disabled type="number" class="weight" min="0" max="100">)
                </td>
             </tr>`;
        },
        plusTemplate = `<td id="creation-button"><button id="add-criterion">+</button></td>`,
        minusTemplate = `<td id="delete-button"><button id="delete-criterion">-</button></td>`,
        expertTemplate = `<th><input type="number" min="0" max="100"><button id="delete-expert">-</button></th>`

    let deleteFn = function () {
        $(this).parent().remove();
    }, addCriteria = function () {
        mainTable.find('td').last().replaceWith($(minusTemplate).click(deleteFn));
        let criteria = $(getCriteriaTemplate(++idCounter));
        mainTable.find('tbody').last().append(criteria);
        criteria
            .find('td')
            .last()
            .after(plusTemplate)
            .next()
            .click(addCriteria);
    }, addExpert = function () {
        let trs = mainTable.find('tr')
        $(trs[1]).last().append(expertTemplate)
        for (let i = 2; i < trs.length; i++) {
            let tr = trs[i];
            let tds = $(tr).find('td');
            tds.eq(0).after(`<td>
            <input  type="number" class="note-input" min="0" max="100" step="10">
            (<input disabled type="number" class="weight" min="0" max="100">)
        </td>`);
        }
        $('#assessment').attr('colspan', trs.find('th').length)

    }, deleteExpert = function () {
        console.log($(this))
    };

    $('#add-criterion').click(addCriteria)
    $('#delete-criterion').click(deleteFn)
    $('#add-expert').click(addExpert)
    $('.calculate_w1').click(() => {
        let val = 0,
            recommendVal = $('#recommendVal'),
            notes = $('.note-input');

        notes.each(function () {
            val = val + parseInt($(this).val())
        })
        recommendVal.val(val / notes.length);
    })

})