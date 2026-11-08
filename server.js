const express = require("express");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");

const students = require("./data");

app.use(express.static("public"));

// READ: All students
app.get("/allstudents", (req, res) => {
    res.render("allStudents", { students });
    // res.status(200).json(students);
});

//search a student
app.get("/searchStudent/", (req, res) => {
    const id = Number(req.query.id);
    if (!id) {
        return res.render("searchStudent", { studentData: null });
    }
    const studentData = students.find((student) => student.id === id);

    if (!studentData) return res.render("noStudent");

    res.render("searchStudent", { studentData });
});

//delete a student
app.get("/delete_page", (req, res) => {
    const id = Number(req.query.id);
    if (!id) {
        return res.render("delete_page", { studentData: null });
    }
    const studentData = students.find((student) => student.id === id);

    if (!studentData) return res.render("noStudent");

    res.render("delete_page", {
        studentData: studentData,
        id: id,
    });
});

app.post("/delete_page/:id", (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id < 1) {
        return res.status(400).send("Invalid student ID");
    }

    const index = students.findIndex((s) => s.id === id);

    if (index === -1) {
        return res.render("delete_page", { studentData: null });
    }

    students.splice(index, 1);
    return res.redirect(`/delete_page?id=${id}`);
});

// patch a student
app.get("/patch", (req, res) => {
    const id = Number(req.query.id);
    if (!id) return res.render("patch", { studentData: null });

    const studentData = students.find((st) => st.id === id);
    const index = students.findIndex((ind) => ind.id === id);
    if (index == -1) return res.render("patch", { studentData: null });

    res.render("patch", {
        studentData: studentData,
        id: id,
    });
});

app.post("/patch", (req, res) => {
    const id = Number(req.body.id);
    const newName = req.body.studentName;
    const newDept = req.body.studentDepartment;
    if (!Number.isInteger(id) || id < 1) {
        return res.status(400).send("Invalid student ID");
    }
    const index = students.findIndex((s) => s.id === id);
    if (index === -1) {
        return res.render("delete_page", { studentData: null });
    }
    if (newName) students[index].name = newName;
    if (newDept) students[index].department = newDept;
    return res.redirect(`/patch?id=${id}`);
});

app.get("/put", (req, res) => {
    const idCreated = Number(req.query.id);
    if (!idCreated) {
        const newId = students.length + 1;

        res.render("put_page", { newId: newId, show: false });
    } else {
        studentData = students[students.length - 1];

        res.render("put_page", { studentData: studentData, show: true });
    }
});

app.post("/put", (req, res) => {
    const id = Number(req.body.id);
    const newName = req.body.studentName;
    const newDept = req.body.studentDepartment;
    const index = id - 1;
    const added_student = {
        id: id,
        name: newName,
        department: newDept,
    };
    students.push(added_student);
    return res.redirect(`/put?id=${id}`);
});

// home page
app.get("/students", (req, res) => {
    res.render("home", { students });
});

app.listen(3000, () => {
    console.log("API running on port 3000");
});
