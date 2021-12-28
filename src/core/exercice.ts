
// Structs

export interface exercicedata_var_t {
	name: string,
	gen: string
}

export interface exercicedata_step_t {
	action?: string,
	store_to?: string,

	explanation?: string,
	condition?: string,
}

export interface exercicedata_t  {
	text: string;
	vars: {
		input: exercicedata_var_t[],    // Input variables are calculated before steps are done
	};
	steps: exercicedata_step_t[] | null | undefined;
	result?: string;
}

// Helpers

/**
 * Calculates the variables according to their gen_method,
 * and writes them in a Map<string var_name, string value \n
 * Each variable can include the previous ones by referencing their name
 * @param vars the variables to replace
 */
export const calculate_vars = (vars:exercicedata_var_t[]): Map<string,string> => {
	let ret = new Map<string, string>();

	vars.forEach(e => {
		// We can also use any previous already-defined variables for the next ones
		// eslint-disable-next-line no-eval
		ret.set(e.name, eval(replace_text_with_vars(e.gen, ret)));
	});

	return ret;
};

/**
 * Replaces the variables found in the text by their value. Its replaced exactly as they are passed.
 * All the exact instances (case-sensitive) are replaced immediately. No field is modified.
 * @param text const => the text used as a base for the variable replacement
 * @param vars const => a Map<string name_of_var, string value_to_replace>
 */
export const replace_text_with_vars = (text:string, vars:Map<string, string>) => {

	let tmp_text = text;

	vars.forEach((v,k) => {
		while(tmp_text.indexOf("$"+k) !== -1)
			tmp_text = tmp_text.replace("$"+k, v);
	});

	return tmp_text;
};

export const get_step_text = (step?: exercicedata_step_t, vars?:Map<string, string>) => {
	

	if(step === undefined || step === null || step.explanation === undefined || step.explanation === null)
		return "";

	if(vars === undefined)
		vars = new Map<string, string>();

	if(!step.condition || eval(replace_text_with_vars(step.condition, vars)))
		return replace_text_with_vars(step.explanation, vars);

	// else // condition is not met
		// return "CONDITION " + replace_text_with_vars(step.condition, vars) + " ==> " + eval(replace_text_with_vars(step.condition, vars)) + " FAILED";
		
	
	return "";
}
