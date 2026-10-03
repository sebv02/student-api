let students = [
 { id: 1, name: "Болд", age: 20, course: "Web" },
 { id: 2, name: "Сараа", age: 21, course: "Database" },
 { id: 3, name: "Тэмүүжин", age: 19, course: "Web" }
];
let nextId = 4;
function validateStudent(body) {
 const { name, age, course } = body || {};
 if (!name || typeof name !== "string") return "name талбар шаардлагатай";
 if (!Number.isInteger(age) || age < 16 || age > 100)
 return "age нь 16-100 хоорондох бүхэл тоо байх ёстой";
 if (!course || typeof course !== "string") return "course талбар шаардлагатай";
 return null;
}
function fail(res, status, message) {
 return res.status(status).json({ success: false, message });
}
exports.getAll = (req, res) => {
 const { age, course, page = 1, limit = 10 } = req.query;
 let result = students;
 if (age) result = result.filter((s) => s.age === Number(age));
 if (course)
 result = result.filter(
 (s) => s.course.toLowerCase() === course.toLowerCase()
 );
 const p = Number(page);
 const l = Number(limit);
 const start = (p - 1) * l;
 res.json({
 total: result.length,
 page: p,
 limit: l,
 data: result.slice(start, start + l)
 });
};
exports.getOne = (req, res) => {
 const id = Number(req.params.id);
 if (Number.isNaN(id)) return fail(res, 400, "ID нь тоо байх ёстой");
 const student = students.find((s) => s.id === id);
 if (!student) return fail(res, 404, "Оюутан олдсонгүй");
 res.json(student);
};
exports.create = (req, res) => {
 const error = validateStudent(req.body);
 if (error) return fail(res, 400, error);
 const { name, age, course } = req.body;
 const student = { id: nextId++, name, age, course };
 students.push(student);
 res.status(201).json(student);
};
exports.update = (req, res) => {
 const id = Number(req.params.id);
 if (Number.isNaN(id)) return fail(res, 400, "ID нь тоо байх ёстой");
 const index = students.findIndex((s) => s.id === id);
 if (index === -1) return fail(res, 404, "Оюутан олдсонгүй");
 const error = validateStudent(req.body);
 if (error) return fail(res, 400, error);
 const { name, age, course } = req.body;
 students[index] = { id, name, age, course };
 res.json(students[index]);
};
exports.remove = (req, res) => {
     const id = Number(req.params.id);
 if (Number.isNaN(id)) return fail(res, 400, "ID нь тоо байх ёстой");
 const index = students.findIndex((s) => s.id === id);
 if (index === -1) return fail(res, 404, "Оюутан олдсонгүй");
 students.splice(index, 1);
 res.status(204).send();
};