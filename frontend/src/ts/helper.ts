const combineFormData = (formData1: FormData, formData2: FormData): FormData => {
    const data1: object[] = extractDataFromForm(formData1);
    const data2: object[] = extractDataFromForm(formData2);
    const newForm: FormData = new FormData();
    appendDataToForm(newForm, data1 as [string, FormDataEntryValue][]);
    appendDataToForm(newForm, data2 as [string, FormDataEntryValue][]);
    return newForm;
};

const extractDataFromForm = (formData: FormData): object[] => {
    let data: [string, FormDataEntryValue][] = [];
    for (let pair of formData.entries()) {
        data.push(pair);
    }
    return data;
};

const appendDataToForm = (formData: FormData, data: [string, FormDataEntryValue][]): void => {
    for (let i = 0; i < data.length; i++) {
        formData.append(data[i][0], data[i][1]);
    }
};

const helperFn = { combineFormData, extractDataFromForm, appendDataToForm };

export default helperFn;
