const convertFormToArrayObjects = (formData: FormData): object[] => {
    let data: [string, FormDataEntryValue][] = [];
    for (let pair of formData.entries()) {
        data.push(pair);
    }
    return data;
};

const convertArrayObjectsToForm = (data: [string, FormDataEntryValue][]): FormData => {
    const formData: FormData = new FormData();
    for (let i = 0; i < data.length; i++) {
        formData.append(data[i][0], data[i][1]);
    }
    return formData;
};

const helperFn = { convertFormToArrayObjects, convertArrayObjectsToForm };

export default helperFn;
