const InputField = ({ label, register, name, type, required }) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium">{label}</label>
      <input
        {...register(name, { required })}
        type={type}
        className="w-full p-2 mt-1 border rounded"
      />
    </div>
  );
};

export default InputField;
