import os
from flask import Flask, render_template, request, redirect, url_for, flash, session, jsonify
from flask_login import LoginManager, login_user, logout_user, login_required, current_user
from werkzeug.security import generate_password_hash, check_password_hash
import logging
from models import User, HtmlExample, TableExample, FormExample, db

# Configure logging
logging.basicConfig(level=logging.DEBUG)

# Create Flask app
app = Flask(__name__)
app.secret_key = os.environ.get("SESSION_SECRET", "dev_secret_key")

# Configure SQLite database (file-based for persistence)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///site.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

# Initialize login manager
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'

# Initialize the database
db.init_app(app)

# Initialize the database with some sample data
def initialize_database():
    # Create admin user if it doesn't exist
    if not User.query.filter_by(username='admin').first():
        admin = User(
            username='admin',
            email='admin@example.com',
            password_hash=generate_password_hash('adminpass')
        )
        db.session.add(admin)
    
    # Add initial HTML examples
    if not HtmlExample.query.first():
        examples = [
            HtmlExample(
                title='Main Element',
                description='The <main> element represents the main content of a document',
                html_code='<main>\n  <h1>Main Content</h1>\n  <p>This is the primary content of my page.</p>\n</main>',
                element_type='Semantic'
            ),
            HtmlExample(
                title='Section Element',
                description='The <section> element represents a standalone section in a document',
                html_code='<section>\n  <h2>Section Title</h2>\n  <p>This is a section of content.</p>\n</section>',
                element_type='Semantic'
            ),
            HtmlExample(
                title='Article Element',
                description='The <article> element represents a self-contained composition',
                html_code='<article>\n  <h2>Article Title</h2>\n  <p>This is a self-contained piece of content.</p>\n</article>',
                element_type='Semantic'
            ),
            HtmlExample(
                title='Div Element',
                description='The <div> element is a generic container for flow content',
                html_code='<div>\n  <h3>Div Container</h3>\n  <p>This is a generic container.</p>\n</div>',
                element_type='Container'
            ),
            HtmlExample(
                title='Header Element',
                description='The <header> element represents introductory content',
                html_code='<header>\n  <h1>Page Title</h1>\n  <nav>Navigation links here</nav>\n</header>',
                element_type='Semantic'
            ),
            HtmlExample(
                title='Footer Element',
                description='The <footer> element represents a footer for its nearest sectioning content',
                html_code='<footer>\n  <p>Copyright © 2023</p>\n  <p>Contact: example@example.com</p>\n</footer>',
                element_type='Semantic'
            )
        ]
        db.session.add_all(examples)
    
    # Add initial table examples
    if not TableExample.query.first():
        examples = [
            TableExample(
                title='Basic Table',
                description='A simple HTML table with rows and columns',
                html_code='<table>\n  <tr>\n    <th>Name</th>\n    <th>Age</th>\n    <th>Country</th>\n  </tr>\n  <tr>\n    <td>John</td>\n    <td>25</td>\n    <td>USA</td>\n  </tr>\n  <tr>\n    <td>Maria</td>\n    <td>30</td>\n    <td>Spain</td>\n  </tr>\n</table>',
                table_type='Basic'
            ),
            TableExample(
                title='Table with Caption',
                description='A table with a caption element explaining its content',
                html_code='<table>\n  <caption>Monthly Savings</caption>\n  <tr>\n    <th>Month</th>\n    <th>Savings</th>\n  </tr>\n  <tr>\n    <td>January</td>\n    <td>$100</td>\n  </tr>\n  <tr>\n    <td>February</td>\n    <td>$150</td>\n  </tr>\n</table>',
                table_type='With Caption'
            ),
            TableExample(
                title='Table with Colspan',
                description='A table demonstrating the colspan attribute',
                html_code='<table>\n  <tr>\n    <th colspan="2">Name</th>\n    <th>Age</th>\n  </tr>\n  <tr>\n    <td>First</td>\n    <td>Last</td>\n    <td>Years</td>\n  </tr>\n  <tr>\n    <td>John</td>\n    <td>Doe</td>\n    <td>30</td>\n  </tr>\n</table>',
                table_type='With Colspan'
            ),
            TableExample(
                title='Table with Rowspan',
                description='A table demonstrating the rowspan attribute',
                html_code='<table>\n  <tr>\n    <th>Name</th>\n    <td>John Doe</td>\n  </tr>\n  <tr>\n    <th rowspan="2">Phone</th>\n    <td>555-1234</td>\n  </tr>\n  <tr>\n    <td>555-5678</td>\n  </tr>\n</table>',
                table_type='With Rowspan'
            )
        ]
        db.session.add_all(examples)
    
    # Add initial form examples
    if not FormExample.query.first():
        examples = [
            FormExample(
                title='Basic Form',
                description='A simple HTML form with text inputs',
                html_code='<form>\n  <label for="name">Name:</label>\n  <input type="text" id="name" name="name">\n  <label for="email">Email:</label>\n  <input type="email" id="email" name="email">\n  <button type="submit">Submit</button>\n</form>',
                form_type='Basic'
            ),
            FormExample(
                title='Login Form',
                description='A form designed for user login',
                html_code='<form>\n  <label for="username">Username:</label>\n  <input type="text" id="username" name="username">\n  <label for="password">Password:</label>\n  <input type="password" id="password" name="password">\n  <button type="submit">Login</button>\n</form>',
                form_type='Authentication'
            ),
            FormExample(
                title='Form with Checkboxes',
                description='A form with checkbox input elements',
                html_code='<form>\n  <p>Select your interests:</p>\n  <input type="checkbox" id="coding" name="interest" value="coding">\n  <label for="coding">Coding</label><br>\n  <input type="checkbox" id="design" name="interest" value="design">\n  <label for="design">Design</label><br>\n  <input type="checkbox" id="music" name="interest" value="music">\n  <label for="music">Music</label><br>\n  <button type="submit">Submit</button>\n</form>',
                form_type='With Checkboxes'
            ),
            FormExample(
                title='Form with Radio Buttons',
                description='A form with radio button input elements',
                html_code='<form>\n  <p>Select your gender:</p>\n  <input type="radio" id="male" name="gender" value="male">\n  <label for="male">Male</label><br>\n  <input type="radio" id="female" name="gender" value="female">\n  <label for="female">Female</label><br>\n  <input type="radio" id="other" name="gender" value="other">\n  <label for="other">Other</label><br>\n  <button type="submit">Submit</button>\n</form>',
                form_type='With Radio Buttons'
            ),
            FormExample(
                title='Form with Select Dropdown',
                description='A form with a select dropdown menu',
                html_code='<form>\n  <label for="country">Country:</label>\n  <select id="country" name="country">\n    <option value="usa">USA</option>\n    <option value="canada">Canada</option>\n    <option value="uk">United Kingdom</option>\n    <option value="australia">Australia</option>\n  </select>\n  <button type="submit">Submit</button>\n</form>',
                form_type='With Select Dropdown'
            ),
            FormExample(
                title='Form with Textarea',
                description='A form with a textarea for longer text input',
                html_code='<form>\n  <label for="message">Message:</label><br>\n  <textarea id="message" name="message" rows="4" cols="40"></textarea><br>\n  <button type="submit">Send Message</button>\n</form>',
                form_type='With Textarea'
            )
        ]
        db.session.add_all(examples)
    
    db.session.commit()

# Create database tables and initialize with sample data
with app.app_context():
    db.create_all()
    initialize_database()

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

# Routes
@app.route('/')
def index():
    html_examples = HtmlExample.query.all()
    table_examples = TableExample.query.all()
    form_examples = FormExample.query.all()
    return render_template('index.html', 
                           html_examples=html_examples, 
                           table_examples=table_examples, 
                           form_examples=form_examples)

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')
        
        user = User.query.filter_by(username=username).first()
        
        if user and check_password_hash(user.password_hash, password):
            login_user(user)
            flash('Logged in successfully!', 'success')
            return redirect(url_for('admin'))
        else:
            flash('Invalid username or password', 'error')
    
    return render_template('login.html')

@app.route('/logout')
@login_required
def logout():
    logout_user()
    flash('Logged out successfully!', 'success')
    return redirect(url_for('index'))

@app.route('/admin')
@login_required
def admin():
    html_examples = HtmlExample.query.all()
    table_examples = TableExample.query.all()
    form_examples = FormExample.query.all()
    return render_template('admin.html',
                           html_examples=html_examples,
                           table_examples=table_examples,
                           form_examples=form_examples)

# API endpoints for admin functionality
@app.route('/api/html_examples', methods=['GET', 'POST'])
@login_required
def api_html_examples():
    if request.method == 'POST':
        data = request.json
        example = HtmlExample(
            title=data['title'],
            description=data['description'],
            html_code=data['html_code'],
            element_type=data['element_type']
        )
        db.session.add(example)
        db.session.commit()
        return jsonify({'success': True, 'id': example.id})
    
    examples = HtmlExample.query.all()
    return jsonify([{
        'id': ex.id,
        'title': ex.title,
        'description': ex.description,
        'html_code': ex.html_code,
        'element_type': ex.element_type
    } for ex in examples])

@app.route('/api/html_examples/<int:example_id>', methods=['PUT', 'DELETE'])
@login_required
def api_html_example(example_id):
    example = HtmlExample.query.get_or_404(example_id)
    
    if request.method == 'PUT':
        data = request.json
        example.title = data.get('title', example.title)
        example.description = data.get('description', example.description)
        example.html_code = data.get('html_code', example.html_code)
        example.element_type = data.get('element_type', example.element_type)
        db.session.commit()
        return jsonify({'success': True})
    
    elif request.method == 'DELETE':
        db.session.delete(example)
        db.session.commit()
        return jsonify({'success': True})

@app.route('/api/table_examples', methods=['GET', 'POST'])
@login_required
def api_table_examples():
    if request.method == 'POST':
        data = request.json
        example = TableExample(
            title=data['title'],
            description=data['description'],
            html_code=data['html_code'],
            table_type=data['table_type']
        )
        db.session.add(example)
        db.session.commit()
        return jsonify({'success': True, 'id': example.id})
    
    examples = TableExample.query.all()
    return jsonify([{
        'id': ex.id,
        'title': ex.title,
        'description': ex.description,
        'html_code': ex.html_code,
        'table_type': ex.table_type
    } for ex in examples])

@app.route('/api/table_examples/<int:example_id>', methods=['PUT', 'DELETE'])
@login_required
def api_table_example(example_id):
    example = TableExample.query.get_or_404(example_id)
    
    if request.method == 'PUT':
        data = request.json
        example.title = data.get('title', example.title)
        example.description = data.get('description', example.description)
        example.html_code = data.get('html_code', example.html_code)
        example.table_type = data.get('table_type', example.table_type)
        db.session.commit()
        return jsonify({'success': True})
    
    elif request.method == 'DELETE':
        db.session.delete(example)
        db.session.commit()
        return jsonify({'success': True})

@app.route('/api/form_examples', methods=['GET', 'POST'])
@login_required
def api_form_examples():
    if request.method == 'POST':
        data = request.json
        example = FormExample(
            title=data['title'],
            description=data['description'],
            html_code=data['html_code'],
            form_type=data['form_type']
        )
        db.session.add(example)
        db.session.commit()
        return jsonify({'success': True, 'id': example.id})
    
    examples = FormExample.query.all()
    return jsonify([{
        'id': ex.id,
        'title': ex.title,
        'description': ex.description,
        'html_code': ex.html_code,
        'form_type': ex.form_type
    } for ex in examples])

@app.route('/api/form_examples/<int:example_id>', methods=['PUT', 'DELETE'])
@login_required
def api_form_example(example_id):
    example = FormExample.query.get_or_404(example_id)
    
    if request.method == 'PUT':
        data = request.json
        example.title = data.get('title', example.title)
        example.description = data.get('description', example.description)
        example.html_code = data.get('html_code', example.html_code)
        example.form_type = data.get('form_type', example.form_type)
        db.session.commit()
        return jsonify({'success': True})
    
    elif request.method == 'DELETE':
        db.session.delete(example)
        db.session.commit()
        return jsonify({'success': True})