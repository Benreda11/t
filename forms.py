from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, TextAreaField, SelectField, SubmitField
from wtforms.validators import DataRequired, Email, Length

class LoginForm(FlaskForm):
    username = StringField('Username', validators=[DataRequired()])
    password = PasswordField('Password', validators=[DataRequired()])
    submit = SubmitField('Login')

class HtmlExampleForm(FlaskForm):
    title = StringField('Title', validators=[DataRequired(), Length(max=100)])
    description = TextAreaField('Description', validators=[DataRequired()])
    html_code = TextAreaField('HTML Code', validators=[DataRequired()])
    element_type = StringField('Element Type', validators=[DataRequired(), Length(max=50)])
    submit = SubmitField('Save')

class TableExampleForm(FlaskForm):
    title = StringField('Title', validators=[DataRequired(), Length(max=100)])
    description = TextAreaField('Description', validators=[DataRequired()])
    html_code = TextAreaField('HTML Code', validators=[DataRequired()])
    table_type = StringField('Table Type', validators=[DataRequired(), Length(max=50)])
    submit = SubmitField('Save')

class FormExampleForm(FlaskForm):
    title = StringField('Title', validators=[DataRequired(), Length(max=100)])
    description = TextAreaField('Description', validators=[DataRequired()])
    html_code = TextAreaField('HTML Code', validators=[DataRequired()])
    form_type = StringField('Form Type', validators=[DataRequired(), Length(max=50)])
    submit = SubmitField('Save')
