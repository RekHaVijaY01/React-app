import React, { useState, useEffect } from "react";

const AdminUpload = () => {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [category, setCategory] = useState("decoration");
  const [services, setServices] = useState([]);
  const [editId, setEditId] = useState(null);
  const [isUploaded, setIsUploaded] = useState(false);

  const categories = ["decoration", "cake", "catering", "photography"];
  const cateringSubCategories = ["veg", "nonveg", "dessert", "starter", "sweet", "icecream"];
  const [subCategory, setSubCategory] = useState(""); // used only for catering

  const fetchServices = async () => {
    const res = await fetch(`http://localhost:5000/services`);
    const data = await res.json();
    setServices(data);
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("price", price);
    formData.append("serviceType", category);

    if (category === "catering") {
      formData.append("subCategory", subCategory);
    }

    // Only add image for decoration and cake
    if ((category === "decoration" || category === "cake") && image) {
      formData.append("image", image);
    }

    const endpoint = editId
      ? `http://localhost:5000/update/${editId}`
      : "http://localhost:5000/upload";

    const res = await fetch(endpoint, {
      method: editId ? "PUT" : "POST",
      body: formData,
    });

    const data = await res.json();
    alert(data.message);
    setIsUploaded(true);
    setTimeout(() => setIsUploaded(false), 2000);

    resetForm();
    fetchServices();
  };

  const resetForm = () => {
    setTitle("");
    setPrice("");
    setImage(null);
    setPreview("");
    setEditId(null);
    setCategory("decoration");
    setSubCategory("");
  };

  const handleEdit = (item) => {
    setTitle(item.title);
    setPrice(item.price);
    setCategory(item.serviceType);
    setEditId(item._id);
    setPreview(item.imageUrl ? `http://localhost:5000${item.imageUrl}` : "");
    setSubCategory(item.subCategory || "");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this service?")) return;
    const res = await fetch(`http://localhost:5000/delete/${id}`, {
      method: "DELETE",
    });
    const data = await res.json();
    alert(data.message);
    fetchServices();
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Admin Upload Panel</h2>

      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        {category === "catering" && (
          <select
            value={subCategory}
            onChange={(e) => setSubCategory(e.target.value)}
            required
          >
            <option value="">Select Subcategory</option>
            {cateringSubCategories.map((sub) => (
              <option key={sub} value={sub}>{sub}</option>
            ))}
          </select>
        )}

        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          required
        />

        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Price"
          required
        />

        {/* Image upload ONLY for decoration and cake */}
        {(category === "decoration" || category === "cake") && (
          <>
            <input
              type="file"
              onChange={(e) => {
                setImage(e.target.files[0]);
                setPreview(URL.createObjectURL(e.target.files[0]));
              }}
            />
            {preview && (
              <img
                src={preview}
                alt="preview"
                width="150"
                style={{ display: "block", margin: "10px 0" }}
              />
            )}
          </>
        )}

        <button
          type="submit"
          style={{
            backgroundColor: isUploaded ? "green" : "#007BFF",
            color: "white",
            padding: "10px 20px",
            border: "none",
            cursor: "pointer",
            transition: "background-color 0.3s",
          }}
        >
          {isUploaded ? "✓ Success" : editId ? "Update" : "Upload"}
        </button>
      </form>

      <h3>All Services</h3>
      {services.length === 0 ? (
        <p>No services found.</p>
      ) : (
        <div style={{ display: "grid", gap: "20px" }}>
          {services.map((item) => (
            <div
              key={item._id}
              style={{ border: "1px solid #ccc", padding: "10px" }}
            >
              <strong>Category:</strong> {item.serviceType}<br />
              {item.subCategory && <><strong>Sub:</strong> {item.subCategory}<br /></>}
              {item.imageUrl && (
                <img
                  src={`http://localhost:5000${item.imageUrl}`}
                  alt={item.title}
                  width={120}
                />
              )}
              <h4>{item.title}</h4>
              <p>₹{item.price}</p>
              <button onClick={() => handleEdit(item)}>Edit</button>
              <button
                onClick={() => handleDelete(item._id)}
                style={{ marginLeft: "10px", color: "red" }}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminUpload;
