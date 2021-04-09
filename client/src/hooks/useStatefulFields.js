// this hook saves all the fields input by the user inside the state

import { useState } from "react";

const useStatefulFields = () => {
    const [values, setValues] = useState({});

    const handleChange = (e) => {
        setValues({
            ...values,
            [e.target.name]: e.target.value,
        });
    };

    return [values, handleChange];
};

export default useStatefulFields;
