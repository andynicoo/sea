class SearchFormApi {
  formItems=[];
  form={};
   constructor(formItem,form) {
     this.formItems=formItem;
     this.form=form;
   }
  resetFields(form){
     this.form=form
  }
  searchSubmit(form){
     console.log(form)
  }
}

export default SearchFormApi